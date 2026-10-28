import { starFills } from '../starFills';

test('rounds to the nearest half star', () => {
  expect(starFills(3.9)).toEqual(['full', 'full', 'full', 'full', 'empty']);
  expect(starFills(4.6)).toEqual(['full', 'full', 'full', 'full', 'half']);
  expect(starFills(2.3)).toEqual(['full', 'full', 'half', 'empty', 'empty']);
  expect(starFills(2.2)).toEqual(['full', 'full', 'empty', 'empty', 'empty']);
});

test('covers the ends of the scale', () => {
  expect(starFills(0)).toEqual(['empty', 'empty', 'empty', 'empty', 'empty']);
  expect(starFills(4.8)).toEqual(['full', 'full', 'full', 'full', 'full']);
  expect(starFills(5)).toEqual(['full', 'full', 'full', 'full', 'full']);
});

test('keeps out-of-range ratings on the scale', () => {
  expect(starFills(-1)).toEqual(starFills(0));
  expect(starFills(7)).toEqual(starFills(5));
});
