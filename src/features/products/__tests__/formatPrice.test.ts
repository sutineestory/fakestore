import { formatPrice } from '../formatPrice';

test('writes US dollars in English', () => {
  expect(formatPrice(109.95, 'en')).toBe('$109.95');
});

test('writes US dollars in Thai', () => {
  expect(formatPrice(109.95, 'th')).toBe('US$109.95');
});

test('always shows cents and groups thousands', () => {
  expect(formatPrice(7, 'en')).toBe('$7.00');
  expect(formatPrice(1234.5, 'en')).toBe('$1,234.50');
});
