import { Animated, StyleSheet } from 'react-native';
import ReactTestRenderer, {
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { lightTheme, radii, ThemeProvider } from '@/theme';
import { Skeleton, type SkeletonProps } from '../Skeleton';

const { act } = ReactTestRenderer;

let renderer: Renderer | undefined;

async function renderSkeleton(props: SkeletonProps = {}) {
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider initialPreference="light">
        <Skeleton {...props} />
      </ThemeProvider>,
    );
  });
  return (renderer as Renderer).root.findByType(Animated.View);
}

let loop: jest.SpyInstance;

beforeEach(() => {
  jest.useFakeTimers();
  loop = jest.spyOn(Animated, 'loop');
});

afterEach(async () => {
  await act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;
  jest.useRealTimers();
  loop.mockRestore();
});

test('is a muted block of the given size and radius', async () => {
  const block = await renderSkeleton({ width: 120, height: 20, radius: 'md' });

  expect(StyleSheet.flatten(block.props.style)).toMatchObject({
    width: 120,
    height: 20,
    borderRadius: radii.md,
    backgroundColor: lightTheme.colors.surfaceMuted,
  });
});

test('spans its container by default', async () => {
  const block = await renderSkeleton();

  expect(StyleSheet.flatten(block.props.style).width).toBe('100%');
});

test('is hidden from screen readers', async () => {
  const block = await renderSkeleton();

  expect(block.props.accessibilityElementsHidden).toBe(true);
  expect(block.props.importantForAccessibility).toBe('no-hide-descendants');
});

test('pulses until it unmounts', async () => {
  await renderSkeleton();

  expect(loop).toHaveBeenCalledTimes(1);
  const pulse = loop.mock.results[0].value as Animated.CompositeAnimation;
  const stop = jest.spyOn(pulse, 'stop');

  await act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;

  expect(stop).toHaveBeenCalled();
});
