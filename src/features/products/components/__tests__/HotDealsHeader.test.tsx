import { Text, TextInput } from 'react-native';
import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { LanguageProvider, type Language } from '@/i18n';
import { ThemeProvider } from '@/theme';
import { HotDealsHeader } from '../HotDealsHeader';

const { act } = ReactTestRenderer;

async function renderHeader({
  query = '',
  onChangeQuery = jest.fn(),
  language,
}: {
  query?: string;
  onChangeQuery?: (query: string) => void;
  language?: Language;
} = {}) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <LanguageProvider initialLanguage={language}>
          <HotDealsHeader query={query} onChangeQuery={onChangeQuery} />
        </LanguageProvider>
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

test('titles the section as a header', async () => {
  const root = await renderHeader();

  const heading = root.findByType(Text);
  expect(heading.props.children).toBe('Hot deals');
  expect(heading.props.accessibilityRole).toBe('header');
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

test('uses the active language', async () => {
  const root = await renderHeader({ language: 'th' });

  expect(root.findByType(Text).props.children).toBe('ดีลเด็ด');
  expect(root.findByType(TextInput).props.placeholder).toBe('ค้นหาดีลเด็ด');
});
