import { carouselIndex } from '../carouselIndex';

// Ten 100pt cards in a 250pt-wide viewport.
function scrolledTo(x: number) {
  return {
    contentOffset: { x },
    layoutMeasurement: { width: 250 },
    contentSize: { width: 1000 },
  };
}

test('starts on the first card', () => {
  expect(carouselIndex(scrolledTo(0), 100, 10)).toBe(0);
});

test('picks the card nearest the left edge', () => {
  expect(carouselIndex(scrolledTo(100), 100, 10)).toBe(1);
  expect(carouselIndex(scrolledTo(240), 100, 10)).toBe(2);
  expect(carouselIndex(scrolledTo(260), 100, 10)).toBe(3);
});

test('treats the end of the scroll as the last card', () => {
  expect(carouselIndex(scrolledTo(750), 100, 10)).toBe(9);
  expect(carouselIndex(scrolledTo(749.5), 100, 10)).toBe(9);
});

test('stays in range when bouncing past either edge', () => {
  expect(carouselIndex(scrolledTo(-40), 100, 10)).toBe(0);
  expect(carouselIndex(scrolledTo(900), 100, 10)).toBe(9);
});

test('is the first card when there are none', () => {
  expect(carouselIndex(scrolledTo(0), 100, 0)).toBe(0);
});
