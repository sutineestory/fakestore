import ReactTestRenderer from 'react-test-renderer';

import { ErrorBoundary } from '@/test-utils/ErrorBoundary';
import {
  LanguageProvider,
  useLanguage,
  useTranslation,
} from '../LanguageProvider';
import type { Language } from '../languages';
import { en } from '../locales/en';
import { th } from '../locales/th';

const { act } = ReactTestRenderer;

type LanguageState = ReturnType<typeof useLanguage> & {
  t: ReturnType<typeof useTranslation>;
};

async function renderLanguage(initialLanguage?: Language) {
  let state!: LanguageState;
  function Probe() {
    state = { ...useLanguage(), t: useTranslation() };
    return null;
  }

  await act(async () => {
    ReactTestRenderer.create(
      <LanguageProvider initialLanguage={initialLanguage}>
        <Probe />
      </LanguageProvider>,
    );
  });

  return () => state;
}

test('defaults to English', async () => {
  const getState = await renderLanguage();

  expect(getState().language).toBe('en');
  expect(getState().t).toBe(en);
});

test('starts in the initial language', async () => {
  const getState = await renderLanguage('th');

  expect(getState().language).toBe('th');
  expect(getState().t).toBe(th);
});

test('setLanguage switches the messages', async () => {
  const getState = await renderLanguage();

  await act(async () => {
    getState().setLanguage('th');
  });
  expect(getState().language).toBe('th');
  expect(getState().t.home.title).toBe('ยินดีต้อนรับ');

  await act(async () => {
    getState().setLanguage('en');
  });
  expect(getState().language).toBe('en');
  expect(getState().t.home.title).toBe('Welcome');
});

test('interpolates parameters in each language', () => {
  expect(en.details.itemNumber('7')).toBe('Item #7');
  expect(th.details.itemNumber('7')).toBe('รายการที่ 7');
});

test.each([
  ['useTranslation', useTranslation],
  ['useLanguage', useLanguage],
])('%s throws outside <LanguageProvider>', async (_name, useHook) => {
  // React logs errors caught by a boundary; keep the test output clean.
  const consoleError = jest.spyOn(console, 'error').mockImplementation();
  const onError = jest.fn();
  function Probe() {
    useHook();
    return null;
  }

  await act(async () => {
    ReactTestRenderer.create(
      <ErrorBoundary onError={onError}>
        <Probe />
      </ErrorBoundary>,
    );
  });

  expect(onError).toHaveBeenCalledWith(
    expect.objectContaining({
      message: 'Language hooks must be used inside <LanguageProvider>.',
    }),
  );

  consoleError.mockRestore();
});
