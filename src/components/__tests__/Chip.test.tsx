import { StyleSheet, Text, View } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { lightTheme, radii, ThemeProvider } from '@/theme';
import { Chip, type ChipProps } from '../Chip';

const { act } = ReactTestRenderer;

const { colors } = lightTheme;

async function renderChip(props: Partial<ChipProps> = {}) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider initialPreference="light">
        <Chip label="men's clothing" {...props} />
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

/** The pressable a toggle chip is built on, and the host view it draws. */
function findToggle(root: ReactTestInstance) {
  const nodes = root.findAll(node => node.props.accessibilityRole === 'button');
  return { pressable: nodes[0], host: nodes[nodes.length - 1] };
}

function styleOf(node: ReactTestInstance) {
  return StyleSheet.flatten(node.props.style);
}

test('shows its label title-cased in the primary color', async () => {
  const root = await renderChip();

  const label = root.findByType(Text);
  expect(label.props.children).toBe("men's clothing");
  expect(styleOf(label)).toMatchObject({
    color: colors.primary,
    textTransform: 'capitalize',
  });
});

test('is a rounded pill that hugs its label', async () => {
  const root = await renderChip();

  expect(styleOf(root.findByType(View))).toMatchObject({
    alignSelf: 'flex-start',
    borderRadius: radii.full,
    backgroundColor: colors.primaryMuted,
  });
});

test('is not pressable', async () => {
  const root = await renderChip();

  expect(
    root.findAll(node => node.props.accessibilityRole === 'button'),
  ).toHaveLength(0);
});

test('toggles when pressed if given onPress', async () => {
  const onPress = jest.fn();
  const root = await renderChip({ onPress });

  await act(async () => {
    findToggle(root).pressable.props.onPress();
  });

  expect(onPress).toHaveBeenCalledTimes(1);
});

test('is an outlined, unselected toggle by default', async () => {
  const root = await renderChip({ onPress: jest.fn() });
  const { pressable, host } = findToggle(root);

  expect(pressable.props.accessibilityState).toEqual({ selected: false });
  expect(styleOf(host)).toMatchObject({
    borderRadius: radii.full,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  });
  expect(styleOf(root.findByType(Text))).toMatchObject({
    color: colors.text,
    textTransform: 'capitalize',
  });
});

test('fills in and announces itself when selected', async () => {
  const root = await renderChip({ onPress: jest.fn(), selected: true });
  const { pressable, host } = findToggle(root);

  expect(pressable.props.accessibilityState).toEqual({ selected: true });
  expect(styleOf(host)).toMatchObject({ backgroundColor: colors.primary });
  expect(styleOf(root.findByType(Text)).color).toBe(colors.onPrimary);
});
