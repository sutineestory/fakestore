import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { LanguageProvider, type Language } from '@/i18n';
import {
  darkTheme,
  lightTheme,
  ThemeProvider,
  type ColorSchemePreference,
} from '@/theme';
import { FavoriteIndicator } from '../FavoriteIndicator';

const { act } = ReactTestRenderer;

type RenderOptions = {
  language?: Language;
  preference?: ColorSchemePreference;
};

async function renderIndicator({ language, preference }: RenderOptions = {}) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider initialPreference={preference}>
        <LanguageProvider initialLanguage={language}>
          <FavoriteIndicator />
        </LanguageProvider>
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

function labels(root: ReactTestInstance) {
  return root
    .findAll(node => typeof node.props.accessibilityLabel === 'string')
    .map(node => node.props.accessibilityLabel);
}

test('announces itself as a favorite', async () => {
  const root = await renderIndicator();

  expect(labels(root)).toContain('Favorite');
});

test('uses the active language', async () => {
  const root = await renderIndicator({ language: 'th' });

  expect(labels(root)).toContain('รายการโปรด');
});

test('draws a heart filled with the favorite color', async () => {
  const light = await renderIndicator({ preference: 'light' });

  expect(
    light.findAll(node => node.props.fill === lightTheme.colors.favorite),
  ).not.toHaveLength(0);

  const dark = await renderIndicator({ preference: 'dark' });

  expect(
    dark.findAll(node => node.props.fill === darkTheme.colors.favorite),
  ).not.toHaveLength(0);
});
