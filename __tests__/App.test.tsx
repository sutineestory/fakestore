/**
 * @format
 */

import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';

import App from '@/App';

const { act } = ReactTestRenderer;

function hasText(node: ReactTestInstance, text: string) {
  return (
    node.findAll(
      child => typeof child.type === 'string' && child.props.children === text,
    ).length > 0
  );
}

function hasFavoriteStar(node: ReactTestInstance) {
  return (
    node.findAll(child => child.props.accessibilityLabel === 'Favorite')
      .length > 0
  );
}

function findButton(root: ReactTestInstance, text: string) {
  return root.find(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function' &&
      hasText(node, text),
  );
}

function findTab(root: ReactTestInstance, label: string) {
  // Tab items nest several pressables; the outermost one handles the press.
  const [tab] = root.findAll(
    node =>
      node.props.role === 'button' &&
      typeof node.props.onPress === 'function' &&
      hasText(node, label),
  );
  return tab;
}

async function renderApp() {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(<App />);
    jest.runOnlyPendingTimers();
  });
  return renderer;
}

async function press(node: ReactTestInstance) {
  await act(async () => {
    node.props.onPress();
    jest.runOnlyPendingTimers();
  });
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test('renders the Home tab and navigates to Details', async () => {
  const renderer = await renderApp();

  expect(hasText(renderer.root, 'Welcome')).toBe(true);

  await press(findButton(renderer.root, 'Design system'));

  expect(hasText(renderer.root, 'Item #2')).toBe(true);

  await act(async () => {
    renderer.unmount();
  });
});

test('opens the sample list from Home', async () => {
  const renderer = await renderApp();

  await press(findButton(renderer.root, 'Open sample list'));
  // The list fetches on mount, so its mock latency starts after the push.
  await act(async () => {
    jest.runOnlyPendingTimers();
  });

  expect(
    hasText(renderer.root, 'Loaded from a mock service. Pull down to refresh.'),
  ).toBe(true);
  expect(hasText(renderer.root, 'Sample item 1')).toBe(true);

  await act(async () => {
    renderer.unmount();
  });
});

test('switches to the Products tab', async () => {
  const renderer = await renderApp();

  expect(findTab(renderer.root, 'Products').props['aria-selected']).toBe(false);

  await press(findTab(renderer.root, 'Products'));

  expect(findTab(renderer.root, 'Products').props['aria-selected']).toBe(true);
  expect(findTab(renderer.root, 'Home').props['aria-selected']).toBe(false);

  await act(async () => {
    renderer.unmount();
  });
});

test('stars an item on Home once it is favorited on Details', async () => {
  const renderer = await renderApp();

  expect(hasFavoriteStar(findButton(renderer.root, 'Navigation'))).toBe(false);

  await press(findButton(renderer.root, 'Navigation'));
  await press(findButton(renderer.root, 'Add to favorites'));
  await press(findButton(renderer.root, 'Go back'));

  expect(hasFavoriteStar(findButton(renderer.root, 'Navigation'))).toBe(true);
  expect(hasFavoriteStar(findButton(renderer.root, 'Design system'))).toBe(
    false,
  );

  await act(async () => {
    renderer.unmount();
  });
});

test('switches the whole app to Thai from Settings', async () => {
  const renderer = await renderApp();

  await press(findButton(renderer.root, 'Getting started'));
  await press(findButton(renderer.root, 'Open Settings'));
  await press(findButton(renderer.root, 'ไทย'));

  expect(hasText(renderer.root, 'ภาษา')).toBe(true);
  expect(hasText(renderer.root, 'Language')).toBe(false);

  await press(findTab(renderer.root, 'หน้าแรก'));

  expect(hasText(renderer.root, 'ยินดีต้อนรับ')).toBe(true);

  await press(findButton(renderer.root, 'ระบบดีไซน์'));

  expect(hasText(renderer.root, 'รายการที่ 2')).toBe(true);
  expect(hasText(renderer.root, 'เพิ่มในรายการโปรด')).toBe(true);

  await act(async () => {
    renderer.unmount();
  });
});
