import { Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { ThemeProvider } from '@/theme';
import { SampleListItem } from '../SampleListItem';

const { act } = ReactTestRenderer;

test('shows the item title and description', async () => {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <SampleListItem
          item={{ id: '1', title: 'First', description: 'The first item' }}
        />
      </ThemeProvider>,
    );
  });

  const texts = renderer.root
    .findAllByType(Text)
    .map(text => text.props.children);
  expect(texts).toEqual(['First', 'The first item']);
});

test('is not pressable', async () => {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <SampleListItem item={{ id: '1', title: 'First', description: '' }} />
      </ThemeProvider>,
    );
  });

  expect(
    renderer.root.findAll(node => node.props.accessibilityRole === 'button'),
  ).toHaveLength(0);
});
