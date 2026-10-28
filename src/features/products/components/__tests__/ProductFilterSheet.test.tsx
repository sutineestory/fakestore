import { ActivityIndicator, Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { LanguageProvider, type Language } from '@/i18n';
import { ThemeProvider } from '@/theme';
import { fetchCategories } from '../../services/productsService';
import { ProductFilterSheet } from '../ProductFilterSheet';

jest.mock('../../services/productsService');

const { act } = ReactTestRenderer;

const mockFetchCategories = jest.mocked(fetchCategories);

const CATEGORIES = ['electronics', 'jewelery', "men's clothing"];

let renderer: Renderer | undefined;

async function renderSheet({
  visible = true,
  selected = [],
  onToggle = jest.fn(),
  onClear = jest.fn(),
  onClose = jest.fn(),
  language,
}: {
  visible?: boolean;
  selected?: string[];
  onToggle?: (category: string) => void;
  onClear?: () => void;
  onClose?: () => void;
  language?: Language;
} = {}) {
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <LanguageProvider initialLanguage={language}>
          <ProductFilterSheet
            visible={visible}
            selected={selected}
            onToggle={onToggle}
            onClear={onClear}
            onClose={onClose}
          />
        </LanguageProvider>
      </ThemeProvider>,
    );
  });
  return (renderer as Renderer).root;
}

function texts(root: ReactTestInstance) {
  return root.findAllByType(Text).map(text => text.props.children);
}

function findButton(root: ReactTestInstance, title: string) {
  return root.find(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function' &&
      node.findAllByType(Text).some(text => text.props.children === title),
  );
}

function selectedCategories(root: ReactTestInstance) {
  return CATEGORIES.filter(
    category =>
      findButton(root, category).props.accessibilityState?.selected === true,
  );
}

beforeEach(() => {
  mockFetchCategories.mockReset();
  mockFetchCategories.mockResolvedValue(CATEGORIES);
});

afterEach(async () => {
  await act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;
});

test('shows nothing while closed, but loads the categories already', async () => {
  const root = await renderSheet({ visible: false });

  expect(texts(root)).toEqual([]);
  expect(mockFetchCategories).toHaveBeenCalledTimes(1);
});

test('lists every category as a toggle with the actions under them', async () => {
  const root = await renderSheet();

  expect(texts(root)).toEqual([
    'Filter by category',
    'electronics',
    'jewelery',
    "men's clothing",
    'Clear',
    'Done',
  ]);
});

test('marks only the chosen categories as selected', async () => {
  const root = await renderSheet({ selected: ['jewelery'] });

  expect(selectedCategories(root)).toEqual(['jewelery']);
});

test('reports the pressed category', async () => {
  const onToggle = jest.fn();
  const root = await renderSheet({ onToggle });

  await act(async () => {
    findButton(root, "men's clothing").props.onPress();
  });

  expect(onToggle).toHaveBeenCalledWith("men's clothing");
});

test('can only clear once a category is chosen', async () => {
  const onClear = jest.fn();
  const root = await renderSheet({ onClear });

  expect(findButton(root, 'Clear').props.disabled).toBe(true);

  await act(async () => {
    renderer?.update(
      <ThemeProvider>
        <LanguageProvider>
          <ProductFilterSheet
            visible
            selected={['electronics']}
            onToggle={jest.fn()}
            onClear={onClear}
            onClose={jest.fn()}
          />
        </LanguageProvider>
      </ThemeProvider>,
    );
  });
  await act(async () => {
    findButton(root, 'Clear').props.onPress();
  });

  expect(findButton(root, 'Clear').props.disabled).toBe(false);
  expect(onClear).toHaveBeenCalledTimes(1);
});

test('closes from its done button', async () => {
  const onClose = jest.fn();
  const root = await renderSheet({ onClose });

  await act(async () => {
    findButton(root, 'Done').props.onPress();
  });

  expect(onClose).toHaveBeenCalledTimes(1);
});

test('shows a spinner until the categories load', async () => {
  mockFetchCategories.mockReturnValueOnce(new Promise(() => {}));
  const root = await renderSheet();

  expect(root.findByType(ActivityIndicator).props.accessibilityLabel).toBe(
    'Loading categories',
  );
});

test('offers a retry when the categories fail to load', async () => {
  mockFetchCategories.mockRejectedValueOnce(new Error('Network down'));
  const root = await renderSheet();

  expect(texts(root)).toContain('Couldn’t load the categories.');

  await act(async () => {
    findButton(root, 'Try again').props.onPress();
  });

  expect(mockFetchCategories).toHaveBeenCalledTimes(2);
  expect(texts(root)).toContain('jewelery');
});

test('says when there are no categories', async () => {
  mockFetchCategories.mockResolvedValueOnce([]);
  const root = await renderSheet();

  expect(texts(root)).toContain('No categories yet.');
});

test('uses the active language', async () => {
  const root = await renderSheet({ language: 'th' });

  expect(texts(root)).toEqual([
    'กรองตามหมวดหมู่',
    'electronics',
    'jewelery',
    "men's clothing",
    'ล้าง',
    'เสร็จสิ้น',
  ]);
});
