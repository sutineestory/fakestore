import { ShoppingCartIcon } from 'lucide-react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { Icon } from '@/components';
import { LanguageProvider, type Language } from '@/i18n';
import { ThemeProvider } from '@/theme';
import { CartButton } from '../CartButton';

const { act } = ReactTestRenderer;

async function renderCartButton(language?: Language) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <LanguageProvider initialLanguage={language}>
          <CartButton />
        </LanguageProvider>
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

function findButton(root: ReactTestInstance) {
  return root.findAll(node => node.props.accessibilityRole === 'button')[0];
}

test('is a labelled cart icon button', async () => {
  const root = await renderCartButton();

  expect(findButton(root).props.accessibilityLabel).toBe('Cart');
  expect(root.findByType(Icon).props.icon).toBe(ShoppingCartIcon);
});

test('does nothing yet', async () => {
  const root = await renderCartButton();

  expect(findButton(root).props.onPress).toBeUndefined();
});

test('uses the active language', async () => {
  const root = await renderCartButton('th');

  expect(findButton(root).props.accessibilityLabel).toBe('ตะกร้า');
});
