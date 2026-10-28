import { Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { LanguageProvider, type Language } from '@/i18n';
import { ThemeProvider } from '@/theme';
import type { ProductSort } from '../../sortProducts';
import { ProductSortSheet } from '../ProductSortSheet';

const { act } = ReactTestRenderer;

async function renderSheet({
  visible = true,
  value = 'recommended',
  onChange = jest.fn(),
  onClose = jest.fn(),
  language,
}: {
  visible?: boolean;
  value?: ProductSort;
  onChange?: (sort: ProductSort) => void;
  onClose?: () => void;
  language?: Language;
} = {}) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <LanguageProvider initialLanguage={language}>
          <ProductSortSheet
            visible={visible}
            value={value}
            onChange={onChange}
            onClose={onClose}
          />
        </LanguageProvider>
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

function texts(root: ReactTestInstance) {
  return root.findAllByType(Text).map(text => text.props.children);
}

function findOptions(root: ReactTestInstance) {
  return root.findAll(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function',
  );
}

function labelOf(option: ReactTestInstance) {
  return option.findByType(Text).props.children;
}

test('shows nothing while closed', async () => {
  expect(texts(await renderSheet({ visible: false }))).toEqual([]);
});

test('lists every order under its heading', async () => {
  const root = await renderSheet();

  expect(texts(root)).toEqual([
    'Sort by',
    'Recommended',
    'Price: low to high',
    'Price: high to low',
    'Top rated',
    'Name: A to Z',
  ]);
});

test('marks only the current order as selected', async () => {
  const root = await renderSheet({ value: 'rating' });

  const selected = findOptions(root)
    .filter(option => option.props.accessibilityState?.selected)
    .map(labelOf);
  expect(selected).toEqual(['Top rated']);
});

test('reports the chosen order and closes', async () => {
  const onChange = jest.fn();
  const onClose = jest.fn();
  const root = await renderSheet({ onChange, onClose });

  const option = findOptions(root).find(
    node => labelOf(node) === 'Price: high to low',
  );
  await act(async () => {
    option?.props.onPress();
  });

  expect(onChange).toHaveBeenCalledWith('priceHighToLow');
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('uses the active language', async () => {
  const root = await renderSheet({ language: 'th' });

  expect(texts(root)).toEqual([
    'เรียงตาม',
    'แนะนำ',
    'ราคา: ต่ำไปสูง',
    'ราคา: สูงไปต่ำ',
    'คะแนนสูงสุด',
    'ชื่อ: A ถึง Z',
  ]);
});
