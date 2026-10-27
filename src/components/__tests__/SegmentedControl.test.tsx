import { Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { ThemeProvider } from '@/theme';
import {
  SegmentedControl,
  type SegmentedControlOption,
} from '../SegmentedControl';

const { act } = ReactTestRenderer;

type Size = 'sm' | 'md' | 'lg';

const OPTIONS: SegmentedControlOption<Size>[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];

async function renderSegments(
  options: SegmentedControlOption<Size>[],
  value: Size,
  onChange: (value: Size) => void = jest.fn(),
) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <SegmentedControl options={options} value={value} onChange={onChange} />
      </ThemeProvider>,
    );
  });

  return renderer.root.findAll(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function',
  );
}

function labelOf(segment: ReactTestInstance) {
  return segment.findByType(Text).props.children;
}

function isSelected(segment: ReactTestInstance) {
  return segment.props.accessibilityState?.selected === true;
}

test('renders a segment per option, in order', async () => {
  const segments = await renderSegments(OPTIONS, 'sm');

  expect(segments.map(labelOf)).toEqual(['Small', 'Medium', 'Large']);
});

test('marks only the current value as selected', async () => {
  const segments = await renderSegments(OPTIONS, 'md');

  expect(segments.map(isSelected)).toEqual([false, true, false]);
});

test('selects nothing when the value matches no option', async () => {
  const segments = await renderSegments(OPTIONS.slice(0, 2), 'lg');

  expect(segments.map(isSelected)).toEqual([false, false]);
});

test('reports the pressed option', async () => {
  const onChange = jest.fn();
  const segments = await renderSegments(OPTIONS, 'sm', onChange);

  await act(async () => {
    segments[2].props.onPress();
  });

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith('lg');
});

test('renders no segments without options', async () => {
  const segments = await renderSegments([], 'sm');

  expect(segments).toHaveLength(0);
});
