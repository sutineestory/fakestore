import { Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { ThemeProvider } from '@/theme';
import { NoticeSheet } from '../NoticeSheet';

const { act } = ReactTestRenderer;

async function renderSheet(visible: boolean, onClose = jest.fn()) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <NoticeSheet
          visible={visible}
          title="Heads up"
          message="Something to know."
          okLabel="OK"
          onClose={onClose}
        />
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

function texts(root: ReactTestInstance) {
  return root.findAllByType(Text).map(text => text.props.children);
}

test('shows nothing while closed', async () => {
  expect(texts(await renderSheet(false))).toEqual([]);
});

test('shows its title, message and button', async () => {
  const root = await renderSheet(true);

  expect(texts(root)).toEqual(['Heads up', 'Something to know.', 'OK']);
  expect(
    root.findAll(
      node =>
        node.props.accessibilityRole === 'header' &&
        typeof node.type === 'string',
    ),
  ).toHaveLength(1);
});

test('closes from its button', async () => {
  const onClose = jest.fn();
  const root = await renderSheet(true, onClose);

  const ok = root.find(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function' &&
      node.findAllByType(Text).some(text => text.props.children === 'OK'),
  );
  await act(async () => {
    ok.props.onPress();
  });

  expect(onClose).toHaveBeenCalledTimes(1);
});
