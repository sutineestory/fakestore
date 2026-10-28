import { ActivityIndicator, Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { LanguageProvider } from '@/i18n';
import { ThemeProvider } from '@/theme';
import { ProductListFooter } from '../ProductListFooter';

const { act } = ReactTestRenderer;

async function renderFooter(
  loadingMore: boolean,
  loadMoreFailed: boolean,
  onRetry: () => void = jest.fn(),
) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <LanguageProvider>
          <ProductListFooter
            loadingMore={loadingMore}
            loadMoreFailed={loadMoreFailed}
            onRetry={onRetry}
          />
        </LanguageProvider>
      </ThemeProvider>,
    );
  });
  return renderer;
}

test('renders nothing between pages', async () => {
  const renderer = await renderFooter(false, false);

  expect(renderer.toJSON()).toBeNull();
});

test('shows a labelled spinner while the next page loads', async () => {
  const renderer = await renderFooter(true, false);

  expect(
    renderer.root.findByType(ActivityIndicator).props.accessibilityLabel,
  ).toBe('Loading products');
});

test('explains a failed page and retries on press', async () => {
  const onRetry = jest.fn();
  const renderer = await renderFooter(false, true, onRetry);

  expect(
    renderer.root.findAllByType(Text).map(text => text.props.children),
  ).toEqual(['Couldn’t load more products.', 'Try again']);

  const retry = renderer.root.find(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function',
  );
  await act(async () => {
    retry.props.onPress();
  });

  expect(onRetry).toHaveBeenCalledTimes(1);
});
