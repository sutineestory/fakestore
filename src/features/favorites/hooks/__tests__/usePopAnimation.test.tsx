import { Animated } from 'react-native';
import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { usePopAnimation } from '../usePopAnimation';

const { act } = ReactTestRenderer;

type PopAnimation = ReturnType<typeof usePopAnimation>;

const seen: PopAnimation[] = [];

function Probe({ render }: { render: number }) {
  seen[render] = usePopAnimation();
  return null;
}

async function renderPopAnimation() {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(<Probe render={0} />);
  });
  return renderer;
}

let spring: jest.SpyInstance;

beforeEach(() => {
  seen.length = 0;
  jest.useFakeTimers();
  spring = jest.spyOn(Animated, 'spring');
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  spring.mockRestore();
});

test('rests at full size', async () => {
  await renderPopAnimation();
  const [{ scale }] = seen;

  expect(JSON.stringify(scale)).toBe('1');
  expect(spring).not.toHaveBeenCalled();
});

test('pop shrinks the scale and springs it back on the native thread', async () => {
  await renderPopAnimation();
  const [{ scale, pop }] = seen;
  const setValue = jest.spyOn(scale, 'setValue');

  await act(async () => pop());

  expect(setValue).toHaveBeenCalledWith(0.6);
  expect(spring).toHaveBeenCalledTimes(1);
  expect(spring).toHaveBeenCalledWith(
    scale,
    expect.objectContaining({ toValue: 1, useNativeDriver: true }),
  );
});

test('keeps the same scale and pop across renders', async () => {
  const renderer = await renderPopAnimation();
  await act(async () => {
    renderer.update(<Probe render={1} />);
  });

  expect(seen[1].scale).toBe(seen[0].scale);
  expect(seen[1].pop).toBe(seen[0].pop);
});
