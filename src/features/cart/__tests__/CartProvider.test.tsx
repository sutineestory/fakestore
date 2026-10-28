import ReactTestRenderer from 'react-test-renderer';

import { ErrorBoundary } from '@/test-utils/ErrorBoundary';
import { CartProvider, useCart } from '../CartProvider';

const { act } = ReactTestRenderer;

type Cart = ReturnType<typeof useCart>;

async function renderCart(initialIds?: number[]) {
  let cart!: Cart;
  function Probe() {
    cart = useCart();
    return null;
  }

  await act(async () => {
    ReactTestRenderer.create(
      <CartProvider initialIds={initialIds}>
        <Probe />
      </CartProvider>,
    );
  });

  return {
    ids: () => [...cart.ids],
    async run(action: (current: Cart) => void) {
      await act(async () => action(cart));
    },
  };
}

test('starts empty', async () => {
  const cart = await renderCart();

  expect(cart.ids()).toEqual([]);
});

test('starts with the initial ids', async () => {
  const cart = await renderCart([3, 1]);

  expect(cart.ids()).toEqual([3, 1]);
});

test('adds products in order, each once', async () => {
  const cart = await renderCart();

  await cart.run(c => c.add(4));
  await cart.run(c => c.add(2));
  await cart.run(c => c.add(4));

  expect(cart.ids()).toEqual([4, 2]);
});

test('removes one product and keeps the rest', async () => {
  const cart = await renderCart([1, 2, 3]);

  await cart.run(c => c.remove(2));

  expect(cart.ids()).toEqual([1, 3]);
});

test('removing a product that is not there changes nothing', async () => {
  const cart = await renderCart([1]);

  await cart.run(c => c.remove(9));

  expect(cart.ids()).toEqual([1]);
});

test('clears everything', async () => {
  const cart = await renderCart([1, 2, 3]);

  await cart.run(c => c.clear());

  expect(cart.ids()).toEqual([]);
});

test('useCart throws outside <CartProvider>', async () => {
  // React logs errors caught by a boundary; keep the test output clean.
  const consoleError = jest.spyOn(console, 'error').mockImplementation();
  const onError = jest.fn();
  function Probe() {
    useCart();
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
      message: 'useCart must be used inside <CartProvider>.',
    }),
  );

  consoleError.mockRestore();
});
