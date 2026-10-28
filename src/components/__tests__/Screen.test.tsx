import { ScrollView, Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { ThemeProvider } from '@/theme';
import { Screen, type ScreenProps } from '../Screen';

const { act } = ReactTestRenderer;

async function renderScreen(props: Partial<ScreenProps> = {}) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <Screen {...props}>
          <Text>Content</Text>
        </Screen>
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

function texts(root: ReactTestInstance) {
  return root.findAllByType(Text).map(text => text.props.children);
}

test('scrolls its content when asked to', async () => {
  expect(
    (await renderScreen({ scroll: true })).findAllByType(ScrollView),
  ).toHaveLength(1);
  expect((await renderScreen()).findAllByType(ScrollView)).toHaveLength(0);
});

test('pins the footer below the scrolling content', async () => {
  const root = await renderScreen({
    scroll: true,
    footer: <Text>Footer</Text>,
  });

  expect(texts(root)).toEqual(['Content', 'Footer']);
  const scroll = root.findByType(ScrollView);
  expect(texts(scroll)).toEqual(['Content']);
});

test('renders no footer by default', async () => {
  const root = await renderScreen({ scroll: true });

  expect(texts(root)).toEqual(['Content']);
});
