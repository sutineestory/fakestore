import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { usePersistedState, type Persistence } from '../usePersistedState';

const { act } = ReactTestRenderer;

const load = jest.fn<Promise<string[]>, []>();
const save = jest.fn<Promise<void>, [string[]]>();

const PERSISTENCE: Persistence<string[]> = {
  load: () => load(),
  save: value => save(value),
  merge: (stored, current) => [...stored, ...current],
};

let renderer: Renderer | undefined;

async function renderPersisted(initial: string[] = []) {
  let state!: ReturnType<typeof usePersistedState<string[]>>;
  function Probe() {
    state = usePersistedState(initial, PERSISTENCE);
    return null;
  }

  await act(async () => {
    renderer = ReactTestRenderer.create(<Probe />);
  });

  return {
    value: () => state[0],
    async append(item: string) {
      await act(async () => {
        state[1](current => [...current, item]);
      });
    },
  };
}

function nextRead() {
  const read = Promise.withResolvers<string[]>();
  load.mockReturnValueOnce(read.promise);
  return read;
}

beforeEach(() => {
  load.mockReset();
  save.mockReset();
  load.mockResolvedValue([]);
  save.mockResolvedValue();
});

afterEach(async () => {
  await act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;
});

test('restores the stored value', async () => {
  load.mockResolvedValue(['a', 'b']);

  const state = await renderPersisted();

  expect(state.value()).toEqual(['a', 'b']);
});

test('merges changes made while the read was in flight', async () => {
  const read = nextRead();
  const state = await renderPersisted();

  await state.append('new');
  await act(async () => read.resolve(['old']));

  expect(state.value()).toEqual(['old', 'new']);
});

test('writes nothing until the stored value is read, then every change', async () => {
  const read = nextRead();
  const state = await renderPersisted();

  await state.append('new');
  expect(save).not.toHaveBeenCalled();

  await act(async () => read.resolve(['old']));
  expect(save).toHaveBeenLastCalledWith(['old', 'new']);

  await state.append('newer');
  expect(save).toHaveBeenLastCalledWith(['old', 'new', 'newer']);
});

test('never writes over storage it could not read', async () => {
  load.mockRejectedValue(new Error('Disk unavailable'));

  const state = await renderPersisted();
  await state.append('new');

  expect(state.value()).toEqual(['new']);
  expect(save).not.toHaveBeenCalled();
});

test('keeps working when a save fails', async () => {
  save.mockRejectedValueOnce(new Error('Disk full'));
  const state = await renderPersisted();

  await state.append('a');
  await state.append('b');

  expect(save).toHaveBeenLastCalledWith(['a', 'b']);
});
