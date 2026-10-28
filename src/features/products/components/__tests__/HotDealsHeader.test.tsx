import { Text, TextInput } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { LanguageProvider, type Language } from '@/i18n';
import { ThemeProvider } from '@/theme';
import type { ProductSort } from '../../sortProducts';
import { HotDealsHeader } from '../HotDealsHeader';

const { act } = ReactTestRenderer;

async function renderHeader({
  query = '',
  onChangeQuery = jest.fn(),
  filterCount = 0,
  onPressFilter = jest.fn(),
  sort = 'recommended',
  onPressSort = jest.fn(),
  language,
}: {
  query?: string;
  onChangeQuery?: (query: string) => void;
  filterCount?: number;
  onPressFilter?: () => void;
  sort?: ProductSort;
  onPressSort?: () => void;
  language?: Language;
} = {}) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <LanguageProvider initialLanguage={language}>
          <HotDealsHeader
            query={query}
            onChangeQuery={onChangeQuery}
            filterCount={filterCount}
            onPressFilter={onPressFilter}
            sort={sort}
            onPressSort={onPressSort}
          />
        </LanguageProvider>
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

function findHeading(root: ReactTestInstance) {
  return root.find(
    node =>
      typeof node.type === 'string' &&
      node.props.accessibilityRole === 'header',
  );
}

function findButton(root: ReactTestInstance, title: string) {
  return root.find(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function' &&
      node.findAllByType(Text).some(text => text.props.children === title),
  );
}

test('titles the section as a header', async () => {
  const root = await renderHeader();

  expect(findHeading(root).props.children).toBe('Hot deals');
});

test('shows the query in a labelled search field', async () => {
  const root = await renderHeader({ query: 'jacket' });

  const field = root.findByType(TextInput);
  expect(field.props.value).toBe('jacket');
  expect(field.props.placeholder).toBe('Search hot deals');
  expect(field.props.accessibilityLabel).toBe('Search hot deals');
  expect(field.props.returnKeyType).toBe('search');
});

test('reports what is typed', async () => {
  const onChangeQuery = jest.fn();
  const root = await renderHeader({ onChangeQuery });

  await act(async () => {
    root.findByType(TextInput).props.onChangeText('ring');
  });

  expect(onChangeQuery).toHaveBeenCalledWith('ring');
});

test('opens the filter from its button', async () => {
  const onPressFilter = jest.fn();
  const root = await renderHeader({ onPressFilter });

  await act(async () => {
    findButton(root, 'Filter').props.onPress();
  });

  expect(onPressFilter).toHaveBeenCalledTimes(1);
});

test('counts the chosen categories on the filter button', async () => {
  const root = await renderHeader({ filterCount: 2 });

  expect(findButton(root, 'Filter (2)')).toBeDefined();
});

test('opens the sort from its button', async () => {
  const onPressSort = jest.fn();
  const root = await renderHeader({ onPressSort });

  await act(async () => {
    findButton(root, 'Sort').props.onPress();
  });

  expect(onPressSort).toHaveBeenCalledTimes(1);
});

test('reads out the current order on the sort button', async () => {
  const root = await renderHeader({ sort: 'priceLowToHigh' });

  expect(findButton(root, 'Sort').props.accessibilityValue).toEqual({
    text: 'Price: low to high',
  });
});

test('uses the active language', async () => {
  const root = await renderHeader({ language: 'th' });

  expect(findHeading(root).props.children).toBe('ดีลเด็ด');
  expect(root.findByType(TextInput).props.placeholder).toBe('ค้นหาดีลเด็ด');
  expect(findButton(root, 'ตัวกรอง')).toBeDefined();
  expect(findButton(root, 'เรียงลำดับ').props.accessibilityValue).toEqual({
    text: 'แนะนำ',
  });
});
