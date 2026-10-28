import { StarHalfIcon, StarIcon } from 'lucide-react-native';
import { Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { Icon } from '@/components';
import { LanguageProvider, type Language } from '@/i18n';
import { lightTheme, ThemeProvider } from '@/theme';
import { ProductRating } from '../ProductRating';

const { act } = ReactTestRenderer;

type RenderOptions = {
  language?: Language;
  rate?: number;
  variant?: 'compact' | 'stars';
};

async function renderRating({
  language,
  rate = 4,
  variant,
}: RenderOptions = {}) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider initialPreference="light">
        <LanguageProvider initialLanguage={language}>
          <ProductRating rating={{ rate, count: 259 }} variant={variant} />
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
  const root = await renderRating({ language: 'th' });

  const rating = root.find(node => node.props.accessible === true);
  expect(rating.props.accessibilityLabel).toBe('คะแนน 4.0 จาก 5 · 259 รีวิว');
});

function stars(root: ReactTestInstance) {
  const icons = root.findAllByType(Icon);
  return {
    filled: icons.filter(
      icon =>
        icon.props.icon === StarIcon &&
        icon.props.fill === lightTheme.colors.warning,
    ).length,
    half: icons.filter(icon => icon.props.icon === StarHalfIcon).length,
    slots: icons.filter(icon => icon.props.icon === StarIcon).length,
  };
}

test('shows a single star by default', async () => {
  expect(stars(await renderRating())).toEqual({ filled: 1, half: 0, slots: 1 });
});

test('can show five stars filled to the score', async () => {
  expect(stars(await renderRating({ variant: 'stars', rate: 3.9 }))).toEqual({
    filled: 4,
    half: 0,
    slots: 5,
  });
  expect(stars(await renderRating({ variant: 'stars', rate: 4.6 }))).toEqual({
    filled: 4,
    half: 1,
    slots: 5,
  });
});
