import { Modal, Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { ThemeProvider } from '@/theme';
import { BottomSheet } from '../BottomSheet';

const { act } = ReactTestRenderer;

async function renderSheet(visible: boolean, onClose = jest.fn()) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <BottomSheet visible={visible} onClose={onClose}>
          <Text>Sheet content</Text>
        </BottomSheet>
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

test('stays hidden until opened', async () => {
  const root = await renderSheet(false);

  expect(root.findByType(Modal).props.visible).toBe(false);
});

test('shows its content over a transparent modal', async () => {
  const root = await renderSheet(true);

  const modal = root.findByType(Modal);
  expect(modal.props).toMatchObject({ visible: true, transparent: true });
  expect(root.findByType(Text).props.children).toBe('Sheet content');
});

test('closes when the dimmed area is tapped', async () => {
  const onClose = jest.fn();
  const root = await renderSheet(true, onClose);

  const backdrop = root.find(
    node =>
      node.props.testID === 'bottom-sheet-backdrop' &&
      typeof node.props.onPress === 'function',
  );
  await act(async () => {
    backdrop.props.onPress();
  });

  expect(onClose).toHaveBeenCalledTimes(1);
});

test('closes on Android back', async () => {
  const onClose = jest.fn();
  const root = await renderSheet(true, onClose);

  await act(async () => {
    root.findByType(Modal).props.onRequestClose();
  });

  expect(onClose).toHaveBeenCalledTimes(1);
});
