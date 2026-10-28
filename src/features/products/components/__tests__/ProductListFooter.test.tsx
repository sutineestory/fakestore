import { Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { LanguageProvider } from '@/i18n';
import { ThemeProvider } from '@/theme';
import { ProductListFooter } from '../ProductListFooter';

const { act } = ReactTestRenderer;

/** Skeleton areas announced as loading; host views only, so each counts once. */
function loadingAreas(root: ReactTestInstance) {
  return root.findAll(
    node =>
      typeof node.type === 'string' &&
      node.props.accessibilityRole === 'progressbar',
  );
}

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

test('shows labelled placeholder rows while the next page loads', async () => {
  const renderer = await renderFooter(true, false);

  const [skeleton] = loadingAreas(renderer.root);
  expect(skeleton.props.accessibilityLabel).toBe('Loading products');
  expect(renderer.root.findAllByType(Text)).toHaveLength(0);
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
