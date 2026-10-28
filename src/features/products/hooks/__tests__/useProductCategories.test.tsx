import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { fetchCategories } from '../../services/productsService';
import { useProductCategories } from '../useProductCategories';

jest.mock('../../services/productsService');

const { act } = ReactTestRenderer;

const mockFetchCategories = jest.mocked(fetchCategories);

const CATEGORIES = ['electronics', 'jewelery'];

type Categories = ReturnType<typeof useProductCategories>;

/** Makes the next fetch wait until the test settles it. */
function nextRequest() {
  const request = Promise.withResolvers<string[]>();
  mockFetchCategories.mockReturnValueOnce(request.promise);
  return request;
}

let renderer: Renderer | undefined;

async function renderCategories() {
  let result!: Categories;
  function Probe() {
    result = useProductCategories();
    return null;
  }

  await act(async () => {
    renderer = ReactTestRenderer.create(<Probe />);
  });

  return () => result;
}

beforeEach(() => {
  mockFetchCategories.mockReset();
});

afterEach(async () => {
  await act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;
});

test('loads the categories once on mount', async () => {
  const request = nextRequest();
  const getCategories = await renderCategories();

  expect(getCategories().status).toBe('loading');
  expect(getCategories().categories).toEqual([]);

  await act(async () => request.resolve(CATEGORIES));

  expect(getCategories().status).toBe('success');
  expect(getCategories().categories).toEqual(CATEGORIES);
  expect(mockFetchCategories).toHaveBeenCalledTimes(1);
});

test('succeeds with no categories when the API has none', async () => {
  const request = nextRequest();
  const getCategories = await renderCategories();

  await act(async () => request.resolve([]));

  expect(getCategories().status).toBe('success');
  expect(getCategories().categories).toEqual([]);
});

test('reports a failure and loads again on retry', async () => {
  const failed = nextRequest();
  const getCategories = await renderCategories();
  await act(async () => failed.reject(new Error('Network down')));

  expect(getCategories().status).toBe('error');
  expect(getCategories().categories).toEqual([]);

  const retried = nextRequest();
  await act(async () => getCategories().retry());

  expect(getCategories().status).toBe('loading');

  await act(async () => retried.resolve(CATEGORIES));

  expect(getCategories().status).toBe('success');
  expect(getCategories().categories).toEqual(CATEGORIES);
});

test('ignores categories that arrive after unmount', async () => {
  const request = nextRequest();
  const getCategories = await renderCategories();

  await act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;
  await act(async () => request.resolve(CATEGORIES));

  expect(getCategories().status).toBe('loading');
});
