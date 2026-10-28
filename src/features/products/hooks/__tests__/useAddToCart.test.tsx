import ReactTestRenderer from 'react-test-renderer';

import { CartProvider, useCart } from '@/features/cart';
import { useAddToCart } from '../useAddToCart';

const { act } = ReactTestRenderer;

type AddToCart = ReturnType<typeof useAddToCart>;

async function renderAddToCart(id: number, initialIds?: number[]) {
  let addToCart!: AddToCart;
  let cartIds!: readonly number[];
  function Probe() {
    addToCart = useAddToCart(id);
    cartIds = useCart().ids;
    return null;
  }

  await act(async () => {
    ReactTestRenderer.create(
      <CartProvider initialIds={initialIds}>
        <Probe />
      </CartProvider>,
    );
  });

  return { get: () => addToCart, cartIds: () => [...cartIds] };
}

const TEN = Array.from({ length: 10 }, (_, index) => index + 1);

test('adds the product while there is room', async () => {
  const result = await renderAddToCart(20, [1]);

  expect(result.get().inCart).toBe(false);

  await act(async () => result.get().addToCart());

  expect(result.get().inCart).toBe(true);
  expect(result.cartIds()).toEqual([1, 20]);
  expect(result.get().limitReached).toBe(false);
});

test('refuses a full cart and flags it until dismissed', async () => {
  const result = await renderAddToCart(20, TEN);

  await act(async () => result.get().addToCart());

  expect(result.cartIds()).toEqual(TEN);
  expect(result.get().limitReached).toBe(true);

  await act(async () => result.get().dismissLimit());

  expect(result.get().limitReached).toBe(false);
});
