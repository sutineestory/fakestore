import { Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { ThemeProvider } from '@/theme';
import { ProductDetailScreen } from '../ProductDetailScreen';

const { act } = ReactTestRenderer;

test('renders an empty screen', async () => {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <ProductDetailScreen />
      </ThemeProvider>,
    );
  });

  expect(renderer.root.findAllByType(Text)).toHaveLength(0);
});
