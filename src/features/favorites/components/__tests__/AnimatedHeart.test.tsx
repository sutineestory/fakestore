import { Animated } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { lightTheme, ThemeProvider } from '@/theme';
import { AnimatedHeart } from '../AnimatedHeart';

const { act } = ReactTestRenderer;

async function renderHeart(filled: boolean) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider initialPreference="light">
        <AnimatedHeart filled={filled} scale={new Animated.Value(1)} />
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

function fills(root: ReactTestInstance) {
  return root.findAll(node => node.props.fill === lightTheme.colors.favorite);
}

test('is filled for a favorite', async () => {
  expect(fills(await renderHeart(true))).not.toHaveLength(0);
});

test('is an outline otherwise', async () => {
  expect(fills(await renderHeart(false))).toHaveLength(0);
});
