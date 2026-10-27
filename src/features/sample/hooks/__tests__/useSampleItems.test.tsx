import ReactTestRenderer from 'react-test-renderer';

import { fetchSampleItems } from '../../services/sampleService';
import type { SampleItem } from '../../types';
import { useSampleItems } from '../useSampleItems';

jest.mock('../../services/sampleService');

const { act } = ReactTestRenderer;

const mockFetchSampleItems = jest.mocked(fetchSampleItems);

const ITEMS: SampleItem[] = [
  { id: '1', title: 'First', description: 'One' },
  { id: '2', title: 'Second', description: 'Two' },
];

type SampleItems = ReturnType<typeof useSampleItems>;

/** Makes the next fetch wait until the test settles it. */
function nextRequest() {
  const request = Promise.withResolvers<SampleItem[]>();
  mockFetchSampleItems.mockReturnValueOnce(request.promise);
  return request;
}

async function renderSampleItems() {
  let sampleItems!: SampleItems;
  function Probe() {
    sampleItems = useSampleItems();
    return null;
  }

  await act(async () => {
    ReactTestRenderer.create(<Probe />);
  });

  return () => sampleItems;
}

beforeEach(() => {
  mockFetchSampleItems.mockReset();
});

test('starts loading, then holds the fetched items', async () => {
  const request = nextRequest();
  const getSampleItems = await renderSampleItems();

  expect(getSampleItems().state).toEqual({ status: 'loading' });
  expect(getSampleItems().refreshing).toBe(false);

  await act(async () => request.resolve(ITEMS));

  expect(getSampleItems().state).toEqual({ status: 'success', items: ITEMS });
  expect(mockFetchSampleItems).toHaveBeenCalledTimes(1);
});

test('reports a failed fetch', async () => {
  const request = nextRequest();
  const getSampleItems = await renderSampleItems();
  const error = new Error('Network down');

  await act(async () => request.reject(error));

  expect(getSampleItems().state).toEqual({ status: 'error', error });
});

test('retry shows the loading state again and refetches', async () => {
  const failed = nextRequest();
  const getSampleItems = await renderSampleItems();
  await act(async () => failed.reject(new Error('Network down')));

  const retried = nextRequest();
  await act(async () => getSampleItems().retry());

  expect(getSampleItems().state).toEqual({ status: 'loading' });
  expect(getSampleItems().refreshing).toBe(false);

  await act(async () => retried.resolve(ITEMS));

  expect(getSampleItems().state).toEqual({ status: 'success', items: ITEMS });
  expect(mockFetchSampleItems).toHaveBeenCalledTimes(2);
});

test('refresh keeps the current items until the new ones arrive', async () => {
  const first = nextRequest();
  const getSampleItems = await renderSampleItems();
  await act(async () => first.resolve(ITEMS));

  const refreshed = nextRequest();
  await act(async () => getSampleItems().refresh());

  expect(getSampleItems().refreshing).toBe(true);
  expect(getSampleItems().state).toEqual({ status: 'success', items: ITEMS });

  const nextItems = ITEMS.slice(0, 1);
  await act(async () => refreshed.resolve(nextItems));

  expect(getSampleItems().refreshing).toBe(false);
  expect(getSampleItems().state).toEqual({
    status: 'success',
    items: nextItems,
  });
});

test('stops refreshing when the refresh fails', async () => {
  const first = nextRequest();
  const getSampleItems = await renderSampleItems();
  await act(async () => first.resolve(ITEMS));

  const refreshed = nextRequest();
  await act(async () => getSampleItems().refresh());
  const error = new Error('Network down');
  await act(async () => refreshed.reject(error));

  expect(getSampleItems().refreshing).toBe(false);
  expect(getSampleItems().state).toEqual({ status: 'error', error });
});

test('ignores a response that arrives after a newer request', async () => {
  const first = nextRequest();
  const getSampleItems = await renderSampleItems();

  const second = nextRequest();
  await act(async () => getSampleItems().refresh());
  await act(async () => second.resolve(ITEMS));
  await act(async () => first.resolve([]));

  expect(getSampleItems().state).toEqual({ status: 'success', items: ITEMS });
  expect(getSampleItems().refreshing).toBe(false);
});
