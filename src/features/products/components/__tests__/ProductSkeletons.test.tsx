import type { ReactElement } from 'react';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { Card, Skeleton } from '@/components';
import { ThemeProvider } from '@/theme';
import { DETAIL_IMAGE_HEIGHT, ROW_IMAGE_WIDTH } from '../../layout';
import { FavoritesCarouselSkeleton } from '../FavoritesCarouselSkeleton';
import { ProductDetailSkeleton } from '../ProductDetailSkeleton';
import { ProductListItemSkeleton } from '../ProductListItemSkeleton';
import { ProductListSkeleton } from '../ProductListSkeleton';

const { act } = ReactTestRenderer;

let renderer: Renderer | undefined;

async function render(element: ReactElement) {
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>{element}</ThemeProvider>,
    );
  });
  return (renderer as Renderer).root;
}

/** Host views announced as loading. */
function loadingAreas(root: ReactTestInstance) {
  return root.findAll(
    node =>
      typeof node.type === 'string' &&
      node.props.accessibilityRole === 'progressbar',
  );
}

function hasNoButtons(root: ReactTestInstance) {
  return (
    root.findAll(node => node.props.accessibilityRole === 'button').length === 0
  );
}

// The skeletons pulse on a timer; unmounting stops them.
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(async () => {
  await act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;
  jest.useRealTimers();
});

describe('ProductListItemSkeleton', () => {
  test('mirrors a row: an edge-to-edge photo strip and three lines', async () => {
    const root = await render(<ProductListItemSkeleton />);

    const blocks = root.findAllByType(Skeleton);
    expect(blocks[0].props).toMatchObject({
      width: ROW_IMAGE_WIDTH,
      radius: 'none',
    });
    expect(blocks).toHaveLength(5);
    expect(hasNoButtons(root)).toBe(true);
  });
});

describe('ProductListSkeleton', () => {
  test('draws the requested number of rows as one labelled area', async () => {
    const root = await render(
      <ProductListSkeleton count={3} label="Loading products" />,
    );

    expect(root.findAllByType(ProductListItemSkeleton)).toHaveLength(3);
    const areas = loadingAreas(root);
    expect(areas).toHaveLength(1);
    expect(areas[0].props.accessibilityLabel).toBe('Loading products');
  });
});

describe('FavoritesCarouselSkeleton', () => {
  test('draws a row of cards as one labelled area', async () => {
    const root = await render(
      <FavoritesCarouselSkeleton label="Loading products" />,
    );

    expect(root.findAllByType(Card)).toHaveLength(3);
    expect(loadingAreas(root)[0].props.accessibilityLabel).toBe(
      'Loading products',
    );
    expect(hasNoButtons(root)).toBe(true);
  });
});

describe('ProductDetailSkeleton', () => {
  test('starts with an image block the size of the real one', async () => {
    const root = await render(
      <ProductDetailSkeleton label="Loading the product" />,
    );

    expect(root.findAllByType(Skeleton)[0].props).toMatchObject({
      height: DETAIL_IMAGE_HEIGHT,
    });
    expect(loadingAreas(root)[0].props.accessibilityLabel).toBe(
      'Loading the product',
    );
  });
});
