import { ActivityIndicator, Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { LanguageProvider, type Language } from '@/i18n';
import { ThemeProvider } from '@/theme';
import type { SampleItemsState } from '../../hooks/useSampleItems';
import { SampleListStatus } from '../SampleListStatus';

const { act } = ReactTestRenderer;

type RenderOptions = {
  query?: string;
  onRetry?: () => void;
  language?: Language;
};

async function renderStatus(
  status: SampleItemsState['status'],
  { query = '', onRetry = jest.fn(), language }: RenderOptions = {},
) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <LanguageProvider initialLanguage={language}>
          <SampleListStatus status={status} query={query} onRetry={onRetry} />
        </LanguageProvider>
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

function textsOf(root: ReactTestInstance) {
  return root.findAllByType(Text).map(text => text.props.children);
}

function findButtons(root: ReactTestInstance) {
  return root.findAll(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function',
  );
}

test('shows a labelled spinner while loading', async () => {
  const root = await renderStatus('loading');

  const spinner = root.findByType(ActivityIndicator);
  expect(spinner.props.accessibilityLabel).toBe('Loading items');
  expect(findButtons(root)).toHaveLength(0);
});

test('explains a failure and retries on press', async () => {
  const onRetry = jest.fn();
  const root = await renderStatus('error', { onRetry });

  expect(textsOf(root)).toEqual(['Couldn’t load the items.', 'Try again']);

  const [retry] = findButtons(root);
  await act(async () => {
    retry.props.onPress();
  });

  expect(onRetry).toHaveBeenCalledTimes(1);
});

test('says the list is empty when there is no search', async () => {
  const root = await renderStatus('success');

  expect(textsOf(root)).toEqual(['No items yet.']);
  expect(root.findAllByType(ActivityIndicator)).toHaveLength(0);
});

test('names the search that found nothing', async () => {
  const root = await renderStatus('success', { query: 'cherry' });

  expect(textsOf(root)).toEqual(['No items match “cherry”.']);
});

test('uses the active language', async () => {
  const root = await renderStatus('success', {
    query: 'cherry',
    language: 'th',
  });

  expect(textsOf(root)).toEqual(['ไม่พบรายการที่ตรงกับ “cherry”']);
});
