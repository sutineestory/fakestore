import { StyleSheet, View } from 'react-native';
import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { lightTheme, ThemeProvider } from '@/theme';
import { PageDots } from '../PageDots';

const { act } = ReactTestRenderer;

async function renderDots(count: number, activeIndex: number) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider initialPreference="light">
        <PageDots count={count} activeIndex={activeIndex} />
      </ThemeProvider>,
    );
  });
  return renderer;
}

/** Background color of each dot, in order. */
async function dotColors(count: number, activeIndex: number) {
  const renderer = await renderDots(count, activeIndex);
  return renderer.root
    .findAllByType(View)
    .filter(view => view.props.style && !view.props.accessibilityElementsHidden)
    .map(view => StyleSheet.flatten(view.props.style).backgroundColor)
    .filter(Boolean);
}

test('draws one dot per card and highlights the active one', async () => {
  const { primary, border } = lightTheme.colors;

  expect(await dotColors(3, 1)).toEqual([border, primary, border]);
  expect(await dotColors(3, 2)).toEqual([border, border, primary]);
});

test('is hidden from screen readers', async () => {
  const renderer = await renderDots(3, 0);

  const container = renderer.root.find(
    node => node.props.importantForAccessibility === 'no-hide-descendants',
  );
  expect(container.props.accessibilityElementsHidden).toBe(true);
});

test('renders nothing for fewer than two cards', async () => {
  expect((await renderDots(1, 0)).toJSON()).toBeNull();
  expect((await renderDots(0, 0)).toJSON()).toBeNull();
});
