import { ActivityIndicator, Text } from 'react-native';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import { ThemeProvider } from '@/theme';
import { RequestStatus, type RequestStatusProps } from '../RequestStatus';

const { act } = ReactTestRenderer;

async function renderStatus(
  status: RequestStatusProps['status'],
  onRetry: () => void = jest.fn(),
) {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <RequestStatus
          status={status}
          loadingLabel="Loading things"
          errorMessage="Couldn’t load the things."
          retryLabel="Again"
          emptyMessage="Nothing here."
          onRetry={onRetry}
        />
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

function textsOf(root: ReactTestInstance) {
  return root.findAllByType(Text).map(text => text.props.children);
}

function findButtons(root: ReactTestInstance) {
  return root.findAll(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function',
  );
}

test('shows a labelled spinner while loading', async () => {
  const root = await renderStatus('loading');

  const spinner = root.findByType(ActivityIndicator);
  expect(spinner.props.accessibilityLabel).toBe('Loading things');
  expect(textsOf(root)).toEqual([]);
  expect(findButtons(root)).toHaveLength(0);
});

test('explains a failure and retries on press', async () => {
  const onRetry = jest.fn();
  const root = await renderStatus('error', onRetry);

  expect(textsOf(root)).toEqual(['Couldn’t load the things.', 'Again']);

  const [retry] = findButtons(root);
  await act(async () => {
    retry.props.onPress();
  });

  expect(onRetry).toHaveBeenCalledTimes(1);
});

test('shows the empty message once loaded', async () => {
  const root = await renderStatus('success');

  expect(textsOf(root)).toEqual(['Nothing here.']);
  expect(root.findAllByType(ActivityIndicator)).toHaveLength(0);
  expect(findButtons(root)).toHaveLength(0);
});
