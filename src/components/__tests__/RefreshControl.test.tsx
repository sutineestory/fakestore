import {
  RefreshControl as RNRefreshControl,
  Text,
  type RefreshControlProps,
} from 'react-native';
import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import {
  darkTheme,
  lightTheme,
  ThemeProvider,
  type ColorSchemePreference,
} from '@/theme';
import { RefreshControl } from '../RefreshControl';

const { act } = ReactTestRenderer;

async function renderRefreshControl(
  props: RefreshControlProps,
  preference: ColorSchemePreference = 'light',
) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider initialPreference={preference}>
        <RefreshControl {...props} />
      </ThemeProvider>,
    );
  });
  return renderer.root.findByType(RNRefreshControl);
}

test('uses the theme colors', async () => {
  const light = await renderRefreshControl({ refreshing: false });

  expect(light.props.tintColor).toBe(lightTheme.colors.primary);
  expect(light.props.colors).toEqual([lightTheme.colors.primary]);
  expect(light.props.progressBackgroundColor).toBe(lightTheme.colors.surface);

  const dark = await renderRefreshControl({ refreshing: false }, 'dark');

  expect(dark.props.tintColor).toBe(darkTheme.colors.primary);
  expect(dark.props.progressBackgroundColor).toBe(darkTheme.colors.surface);
});

test('passes refreshing and onRefresh through', async () => {
  const onRefresh = jest.fn();
  const control = await renderRefreshControl({ refreshing: true, onRefresh });

  expect(control.props.refreshing).toBe(true);

  await act(async () => {
    control.props.onRefresh();
  });

  expect(onRefresh).toHaveBeenCalledTimes(1);
});

test('forwards the style and children a ScrollView injects', async () => {
  const style = { flex: 1 };
  const content = <Text>Scroll content</Text>;
  const control = await renderRefreshControl({
    refreshing: false,
    style,
    children: content,
  });

  expect(control.props.style).toBe(style);
  expect(control.props.children).toBe(content);
});

test('lets callers override a theme color', async () => {
  const control = await renderRefreshControl({
    refreshing: false,
    tintColor: 'red',
  });

  expect(control.props.tintColor).toBe('red');
});
