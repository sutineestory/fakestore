import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { LanguageProvider, type Language } from '@/i18n';
import { ThemeProvider } from '@/theme';
import { FavoriteIndicator } from '../FavoriteIndicator';

const { act } = ReactTestRenderer;

async function renderIndicator(language?: Language) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
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
  const root = await renderIndicator('th');

  expect(labels(root)).toContain('รายการโปรด');
});
