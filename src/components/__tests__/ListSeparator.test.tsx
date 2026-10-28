import { StyleSheet, View } from 'react-native';
import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { spacing, ThemeProvider } from '@/theme';
import { ListSeparator } from '../ListSeparator';

const { act } = ReactTestRenderer;

test('spaces rows by the medium spacing token', async () => {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <ListSeparator />
      </ThemeProvider>,
    );
  });

  const separator = renderer.root.findByType(View);
  expect(StyleSheet.flatten(separator.props.style)).toEqual({
    height: spacing.md,
  });
});
