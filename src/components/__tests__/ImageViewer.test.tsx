import { Image, Modal, ScrollView, StyleSheet } from 'react-native';
import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { ThemeProvider } from '@/theme';
import { ImageViewer } from '../ImageViewer';

const { act } = ReactTestRenderer;

const URI = 'https://fakestoreapi.com/img/backpack.png';

async function renderViewer(visible: boolean, onClose = jest.fn()) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <ImageViewer
          uri={URI}
          visible={visible}
          onClose={onClose}
          closeLabel="Close"
        />
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

test('stays hidden until opened', async () => {
  const root = await renderViewer(false);

  expect(root.findByType(Modal).props.visible).toBe(false);
});

test('shows the image full screen and lets it zoom', async () => {
  const root = await renderViewer(true);

  expect(root.findByType(Modal).props.visible).toBe(true);
  expect(root.findByType(Image).props.source).toEqual({ uri: URI });
  expect(root.findByType(ScrollView).props.maximumZoomScale).toBeGreaterThan(1);
});

test('closes from its labelled button', async () => {
  const onClose = jest.fn();
  const root = await renderViewer(true, onClose);

  const close = root.find(
    node =>
      node.props.accessibilityLabel === 'Close' &&
      typeof node.props.onPress === 'function',
  );
  await act(async () => {
    close.props.onPress();
  });

  expect(onClose).toHaveBeenCalledTimes(1);
});

test('keeps the close button inside the safe area', async () => {
  const root = await renderViewer(true);

  const close = root.find(
    node =>
      node.props.accessibilityLabel === 'Close' &&
      typeof node.props.onPress === 'function',
  );
  // Absolute offsets ignore the safe-area padding and land under the notch.
  const style = StyleSheet.flatten(
    typeof close.props.style === 'function'
      ? close.props.style({ pressed: false })
      : close.props.style,
  );
  expect(style.position).not.toBe('absolute');
});

test('closes on Android back', async () => {
  const onClose = jest.fn();
  const root = await renderViewer(true, onClose);

  await act(async () => {
    root.findByType(Modal).props.onRequestClose();
  });

  expect(onClose).toHaveBeenCalledTimes(1);
});
