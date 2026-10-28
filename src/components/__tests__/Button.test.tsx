import { ActivityIndicator, Text, View } from 'react-native';
import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { ThemeProvider } from '@/theme';
import { Button, type ButtonProps } from '../Button';

const { act } = ReactTestRenderer;

async function renderButton(props: Partial<ButtonProps> = {}) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <Button title="Save" {...props} />
      </ThemeProvider>,
    );
  });
  // The outermost node with the role is the one that takes presses.
  return renderer.root.findAll(
    node => node.props.accessibilityRole === 'button',
  )[0];
}

test('shows its title and calls onPress', async () => {
  const onPress = jest.fn();
  const button = await renderButton({ onPress });

  expect(button.findByType(Text).props.children).toBe('Save');

  await act(async () => {
    button.props.onPress();
  });

  expect(onPress).toHaveBeenCalledTimes(1);
});

test('puts the icon before the title', async () => {
  const button = await renderButton({ icon: <View testID="icon" /> });

  // findAll walks the tree in render order; host nodes only, so each counts once.
  const order = button
    .findAll(
      node =>
        typeof node.type === 'string' &&
        (node.props.testID === 'icon' || node.props.children === 'Save'),
    )
    .map(node => (node.props.testID === 'icon' ? 'icon' : 'title'));
  expect(order).toEqual(['icon', 'title']);
});

test('announces and blocks presses while disabled', async () => {
  const button = await renderButton({ disabled: true });

  expect(button.props.disabled).toBe(true);
  expect(button.props.accessibilityState).toMatchObject({ disabled: true });
});

test('swaps its content for a spinner while loading', async () => {
  const button = await renderButton({
    loading: true,
    icon: <View testID="icon" />,
  });

  expect(button.findAllByType(ActivityIndicator)).toHaveLength(1);
  expect(button.findAllByType(Text)).toHaveLength(0);
  expect(button.findAll(node => node.props.testID === 'icon')).toHaveLength(0);
  expect(button.props.disabled).toBe(true);
  expect(button.props.accessibilityState).toMatchObject({ busy: true });
});
