import { fetchSampleItems } from '../sampleService';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test('resolves only after a delay', async () => {
  const onResolve = jest.fn();
  fetchSampleItems().then(onResolve);

  await Promise.resolve();
  expect(onResolve).not.toHaveBeenCalled();

  await jest.runAllTimersAsync();
  expect(onResolve).toHaveBeenCalledTimes(1);
});

test('resolves with titled items that have unique ids', async () => {
  const request = fetchSampleItems();
  await jest.runAllTimersAsync();
  const items = await request;

  expect(items.length).toBeGreaterThan(0);
  expect(new Set(items.map(item => item.id)).size).toBe(items.length);
  expect(items.every(item => item.title.length > 0)).toBe(true);
});
