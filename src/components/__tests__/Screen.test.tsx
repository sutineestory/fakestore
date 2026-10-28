import { ScrollView, StyleSheet, Text } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { lightTheme, spacing, ThemeProvider } from '@/theme';
import { Screen, type ScreenProps } from '../Screen';

const { act } = ReactTestRenderer;

async function renderScreen(props: Partial<ScreenProps> = {}) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider initialPreference="light">
        <Screen {...props}>
          <Text>Content</Text>
        </Screen>
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

function texts(root: ReactTestInstance) {
  return root.findAllByType(Text).map(text => text.props.children);
}

test('scrolls its content when asked to', async () => {
  expect(
    (await renderScreen({ scroll: true })).findAllByType(ScrollView),
  ).toHaveLength(1);
  expect((await renderScreen()).findAllByType(ScrollView)).toHaveLength(0);
});

test('pins the footer below the scrolling content', async () => {
  const root = await renderScreen({
    scroll: true,
    footer: <Text>Footer</Text>,
  });

  expect(texts(root)).toEqual(['Content', 'Footer']);
  const scroll = root.findByType(ScrollView);
  expect(texts(scroll)).toEqual(['Content']);
});

test('renders no footer by default', async () => {
  const root = await renderScreen({ scroll: true });

  expect(texts(root)).toEqual(['Content']);
});

describe('on a device with a home indicator', () => {
  beforeEach(() => {
    jest
      .mocked(useSafeAreaInsets)
      .mockReturnValue({ top: 47, right: 0, bottom: 34, left: 0 });
  });

  afterEach(() => {
    jest.mocked(useSafeAreaInsets).mockReset();
  });

  test('runs the footer down to the bottom edge', async () => {
    const root = await renderScreen({
      scroll: true,
      edges: ['left', 'right', 'bottom'],
      footer: <Text>Footer</Text>,
    });

    // The screen background must not show below the footer…
    expect(root.findByType(SafeAreaView).props.edges).toEqual([
      'left',
      'right',
    ]);
    // …so the footer pads itself clear of the home indicator instead.
    const footer = root
      .findAll(node => typeof node.type === 'string')
      .map(node => StyleSheet.flatten(node.props.style))
      .find(style => style?.backgroundColor === lightTheme.colors.surface);
    expect(footer?.paddingBottom).toBe(spacing.lg + 34);
  });

  test('leaves the bottom inset alone without a footer', async () => {
    const root = await renderScreen({
      scroll: true,
      edges: ['left', 'right', 'bottom'],
    });

    expect(root.findByType(SafeAreaView).props.edges).toEqual([
      'left',
      'right',
      'bottom',
    ]);
  });
});
