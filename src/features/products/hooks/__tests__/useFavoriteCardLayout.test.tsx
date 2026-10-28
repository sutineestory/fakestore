import { useWindowDimensions } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { spacing, ThemeProvider } from '@/theme';
import { useFavoriteCardLayout } from '../useFavoriteCardLayout';

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const { act } = ReactTestRenderer;

async function renderLayout(windowWidth: number) {
  jest.mocked(useWindowDimensions).mockReturnValue({
    width: windowWidth,
    height: 800,
    scale: 3,
    fontScale: 1,
  });
  let layout!: ReturnType<typeof useFavoriteCardLayout>;
  function Probe() {
    layout = useFavoriteCardLayout();
    return null;
  }

  await act(async () => {
    ReactTestRenderer.create(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
  });

  return layout;
}

test('fits two and a half cards across the inset list', async () => {
  const { cardWidth, interval } = await renderLayout(400);

  const visible = (400 - spacing.lg * 2 - spacing.md * 2) / cardWidth;
  expect(visible).toBeCloseTo(2.5, 1);
  expect(interval).toBe(cardWidth + spacing.md);
});

test('grows with the window', async () => {
  const narrow = await renderLayout(360);
  const wide = await renderLayout(430);

  expect(wide.cardWidth).toBeGreaterThan(narrow.cardWidth);
});
