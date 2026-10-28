import { Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { LanguageProvider, type Language } from '@/i18n';
import { ThemeProvider } from '@/theme';
import { FavoritesFullSheet } from '../FavoritesFullSheet';

const { act } = ReactTestRenderer;

async function renderSheet(
  visible: boolean,
  {
    onClose = jest.fn(),
    language,
  }: { onClose?: () => void; language?: Language } = {},
) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <LanguageProvider initialLanguage={language}>
          <FavoritesFullSheet visible={visible} onClose={onClose} />
        </LanguageProvider>
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

function texts(root: ReactTestInstance) {
  return root.findAllByType(Text).map(text => text.props.children);
}

test('shows nothing while closed', async () => {
  expect(texts(await renderSheet(false))).toEqual([]);
});

test('explains the limit of five', async () => {
  const root = await renderSheet(true);

  expect(texts(root)).toEqual([
    'Favorites are full',
    'You can keep up to 5 favorites. Remove one to add another.',
    'Got it',
  ]);
});

test('closes from its button', async () => {
  const onClose = jest.fn();
  const root = await renderSheet(true, { onClose });

  const ok = root.find(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function' &&
      node.findAllByType(Text).some(text => text.props.children === 'Got it'),
  );
  await act(async () => {
    ok.props.onPress();
  });

  expect(onClose).toHaveBeenCalledTimes(1);
});

test('uses the active language', async () => {
  const root = await renderSheet(true, { language: 'th' });

  expect(texts(root)).toEqual([
    'รายการโปรดเต็มแล้ว',
    'เก็บรายการโปรดได้สูงสุด 5 รายการ ลบรายการเดิมออกก่อนจึงจะเพิ่มได้',
    'เข้าใจแล้ว',
  ]);
});
