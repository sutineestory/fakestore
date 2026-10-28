import { sumPrices } from '../sumPrices';
import { makeProduct } from '../testUtils';

test('adds up the prices', () => {
  expect(
    sumPrices([
      makeProduct(1, { price: 109.95 }),
      makeProduct(2, { price: 22.3 }),
    ]),
  ).toBeCloseTo(132.25);
});

test('is zero for no products', () => {
  expect(sumPrices([])).toBe(0);
});
