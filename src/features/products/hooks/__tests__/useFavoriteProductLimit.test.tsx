import { Alert } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { FavoritesProvider } from '@/features/favorites';
import { LanguageProvider, type Language } from '@/i18n';
import { useFavoriteProductLimit } from '../useFavoriteProductLimit';

const { act } = ReactTestRenderer;

async function renderLimit(initialFavoriteIds: string[], language?: Language) {
  let beforeAdd!: () => boolean;
  function Probe() {
    beforeAdd = useFavoriteProductLimit();
    return null;
  }

  await act(async () => {
    ReactTestRenderer.create(
      <LanguageProvider initialLanguage={language}>
        <FavoritesProvider initialFavoriteIds={initialFavoriteIds}>
          <Probe />
        </FavoritesProvider>
      </LanguageProvider>,
    );
  });

  return () => beforeAdd();
}

const FIVE = ['product:1', 'product:2', 'product:3', 'product:4', 'product:5'];

let alert: jest.SpyInstance;

beforeEach(() => {
  alert = jest.spyOn(Alert, 'alert').mockImplementation();
});

afterEach(() => {
  alert.mockRestore();
});

test('allows adding while there is room', async () => {
  const beforeAdd = await renderLimit(FIVE.slice(0, 4));

  expect(beforeAdd()).toBe(true);
  expect(alert).not.toHaveBeenCalled();
});

test('refuses and explains once five products are favorites', async () => {
  const beforeAdd = await renderLimit(FIVE);

  expect(beforeAdd()).toBe(false);
  expect(alert).toHaveBeenCalledWith(
    'Favorites are full',
    'You can keep up to 5 favorites. Remove one to add another.',
  );
});

test('does not count Home items toward the limit', async () => {
  const beforeAdd = await renderLimit([...FIVE.slice(0, 4), '1', '2']);

  expect(beforeAdd()).toBe(true);
});

test('explains in the active language', async () => {
  const beforeAdd = await renderLimit(FIVE, 'th');

  beforeAdd();

  expect(alert).toHaveBeenCalledWith(
    'รายการโปรดเต็มแล้ว',
    'เก็บรายการโปรดได้สูงสุด 5 รายการ ลบรายการเดิมออกก่อนจึงจะเพิ่มได้',
  );
});
