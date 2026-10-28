import {
  ActivityIndicator,
  RefreshControl,
  Text,
  TextInput,
} from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { LanguageProvider, type Language } from '@/i18n';
import { ThemeProvider } from '@/theme';
import { fetchSampleItems } from '../../services/sampleService';
import type { SampleItem } from '../../types';
import { SampleScreen } from '../SampleScreen';

jest.mock('../../services/sampleService');

const { act } = ReactTestRenderer;

const mockFetchSampleItems = jest.mocked(fetchSampleItems);

const ITEMS: SampleItem[] = [
  { id: '1', title: 'Apple pie', description: 'Dessert' },
  { id: '2', title: 'Banana bread', description: 'Baked' },
  { id: '3', title: 'Pineapple', description: 'Fruit' },
];

function nextRequest() {
  const request = Promise.withResolvers<SampleItem[]>();
  mockFetchSampleItems.mockReturnValueOnce(request.promise);
  return request;
}

let renderer: Renderer | undefined;

async function renderScreen(language?: Language) {
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <LanguageProvider initialLanguage={language}>
          <SampleScreen />
        </LanguageProvider>
      </ThemeProvider>,
    );
  });
  return (renderer as Renderer).root;
}

async function renderLoadedScreen(
  items: SampleItem[] = ITEMS,
  language?: Language,
) {
  const request = nextRequest();
  const root = await renderScreen(language);
  await act(async () => request.resolve(items));
  return root;
}

function hasText(root: ReactTestInstance, text: string) {
  return root.findAllByType(Text).some(node => node.props.children === text);
}

function titlesShown(root: ReactTestInstance) {
  return ITEMS.map(item => item.title).filter(title => hasText(root, title));
}

async function search(root: ReactTestInstance, query: string) {
  await act(async () => {
    root.findByType(TextInput).props.onChangeText(query);
  });
}

// FlatList renders more rows on a timer; fake timers keep that from firing
// mid-test, and unmounting cancels it.
beforeEach(() => {
  jest.useFakeTimers();
  mockFetchSampleItems.mockReset();
});

afterEach(async () => {
  await act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;
  jest.useRealTimers();
});

test('shows a spinner until the items load', async () => {
  const request = nextRequest();
  const root = await renderScreen();

  expect(root.findAllByType(ActivityIndicator)).toHaveLength(1);
  expect(titlesShown(root)).toEqual([]);

  await act(async () => request.resolve(ITEMS));

  expect(root.findAllByType(ActivityIndicator)).toHaveLength(0);
  expect(titlesShown(root)).toEqual(['Apple pie', 'Banana bread', 'Pineapple']);
});

test('filters the list by title as you type, ignoring surrounding spaces', async () => {
  const root = await renderLoadedScreen();

  await search(root, '  apple ');

  expect(titlesShown(root)).toEqual(['Apple pie', 'Pineapple']);

  await search(root, '');

  expect(titlesShown(root)).toHaveLength(3);
});

test('says when a search finds nothing', async () => {
  const root = await renderLoadedScreen();

  await search(root, ' cherry ');

  expect(titlesShown(root)).toEqual([]);
  expect(hasText(root, 'No items match “cherry”.')).toBe(true);
});

test('says what found nothing in the active language', async () => {
  const root = await renderLoadedScreen(ITEMS, 'th');

  await search(root, 'cherry');

  expect(hasText(root, 'ไม่พบรายการที่ตรงกับ “cherry”')).toBe(true);
});

test('says when there are no items at all', async () => {
  const root = await renderLoadedScreen([]);

  expect(hasText(root, 'No items yet.')).toBe(true);
});

test('offers a retry after a failed load', async () => {
  const failed = nextRequest();
  const root = await renderScreen();
  await act(async () => failed.reject(new Error('Network down')));

  expect(hasText(root, 'Couldn’t load the items.')).toBe(true);

  const retried = nextRequest();
  const retry = root.find(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function',
  );
  await act(async () => {
    retry.props.onPress();
  });

  expect(root.findAllByType(ActivityIndicator)).toHaveLength(1);

  await act(async () => retried.resolve(ITEMS));

  expect(titlesShown(root)).toHaveLength(3);
});

test('keeps the list while pulling to refresh', async () => {
  const root = await renderLoadedScreen();

  const refreshed = nextRequest();
  await act(async () => {
    root.findByType(RefreshControl).props.onRefresh();
  });

  expect(root.findByType(RefreshControl).props.refreshing).toBe(true);
  expect(titlesShown(root)).toHaveLength(3);

  await act(async () => refreshed.resolve(ITEMS.slice(0, 1)));

  expect(root.findByType(RefreshControl).props.refreshing).toBe(false);
  expect(titlesShown(root)).toEqual(['Apple pie']);
});
