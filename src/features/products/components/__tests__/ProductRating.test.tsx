import { Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { LanguageProvider, type Language } from '@/i18n';
import { lightTheme, ThemeProvider } from '@/theme';
import { ProductRating } from '../ProductRating';

const { act } = ReactTestRenderer;

async function renderRating(language?: Language) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider initialPreference="light">
        <LanguageProvider initialLanguage={language}>
          <ProductRating rating={{ rate: 4, count: 259 }} />
        </LanguageProvider>
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

test('shows a filled star, the score and the review count', async () => {
  const root = await renderRating();

  expect(root.findAllByType(Text).map(text => text.props.children)).toEqual([
    '4.0 (259)',
  ]);
  expect(
    root.findAll(node => node.props.fill === lightTheme.colors.warning),
  ).not.toHaveLength(0);
});

test('reads out as one sentence', async () => {
  const root = await renderRating();

  const rating = root.find(node => node.props.accessible === true);
  expect(rating.props.accessibilityLabel).toBe(
    'Rated 4.0 out of 5 · 259 reviews',
  );
});

test('uses the active language', async () => {
  const root = await renderRating('th');

  const rating = root.find(node => node.props.accessible === true);
  expect(rating.props.accessibilityLabel).toBe('คะแนน 4.0 จาก 5 · 259 รีวิว');
});
