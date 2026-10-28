import { StyleSheet, Text, View } from 'react-native';
import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { lightTheme, radii, ThemeProvider } from '@/theme';
import { Chip } from '../Chip';

const { act } = ReactTestRenderer;

async function renderChip() {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider initialPreference="light">
        <Chip label="men's clothing" />
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

test('shows its label title-cased in the primary color', async () => {
  const root = await renderChip();

  const label = root.findByType(Text);
  expect(label.props.children).toBe("men's clothing");
  expect(StyleSheet.flatten(label.props.style)).toMatchObject({
    color: lightTheme.colors.primary,
    textTransform: 'capitalize',
  });
});

test('is a rounded pill that hugs its label', async () => {
  const root = await renderChip();

  expect(StyleSheet.flatten(root.findByType(View).props.style)).toMatchObject({
    alignSelf: 'flex-start',
    borderRadius: radii.full,
    backgroundColor: lightTheme.colors.primaryMuted,
  });
});

test('is not pressable', async () => {
  const root = await renderChip();

  expect(
    root.findAll(node => node.props.accessibilityRole === 'button'),
  ).toHaveLength(0);
});
