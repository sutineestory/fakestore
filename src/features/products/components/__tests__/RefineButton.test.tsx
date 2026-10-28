import { ArrowUpDownIcon } from 'lucide-react-native';
import { StyleSheet, Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { lightTheme, ThemeProvider } from '@/theme';
import { RefineButton } from '../RefineButton';

const { act } = ReactTestRenderer;

const { colors } = lightTheme;

async function renderButton({
  active = false,
  value,
  onPress = jest.fn(),
}: { active?: boolean; value?: string; onPress?: () => void } = {}) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider initialPreference="light">
        <RefineButton
          title="Sort"
          icon={ArrowUpDownIcon}
          active={active}
          value={value}
          onPress={onPress}
        />
      </ThemeProvider>,
    );
  });
  const root = renderer.root;
  const buttons = root.findAll(
    node => node.props.accessibilityRole === 'button',
  );
  // The outermost takes presses; the innermost is the host view, whose style
  // is already resolved.
  return { root, button: buttons[0], host: buttons[buttons.length - 1] };
}

function backgroundOf(node: ReactTestInstance) {
  return StyleSheet.flatten(node.props.style).backgroundColor;
}

test('shows its icon and title and calls onPress', async () => {
  const onPress = jest.fn();
  const { root, button } = await renderButton({ onPress });

  expect(root.findAllByType(ArrowUpDownIcon)).toHaveLength(1);
  expect(button.findByType(Text).props.children).toBe('Sort');

  await act(async () => {
    button.props.onPress();
  });

  expect(onPress).toHaveBeenCalledTimes(1);
});

test('stays outlined while inactive', async () => {
  const { root, host } = await renderButton();

  expect(backgroundOf(host)).toBe(colors.surface);
  expect(root.findByType(ArrowUpDownIcon).props.color).toBe(colors.text);
});

test('fills in while active', async () => {
  const { root, host } = await renderButton({ active: true });

  expect(backgroundOf(host)).toBe(colors.primary);
  expect(root.findByType(ArrowUpDownIcon).props.color).toBe(colors.onPrimary);
});

test('reads out its value after the title', async () => {
  const { host } = await renderButton({ value: 'Top rated' });

  expect(host.props.accessibilityValue).toMatchObject({ text: 'Top rated' });
});

test('has no value to read without one', async () => {
  const { host } = await renderButton();

  expect(host.props.accessibilityValue?.text).toBeUndefined();
});
