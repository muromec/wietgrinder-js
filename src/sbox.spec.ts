import { it, expect } from 'vitest';
import { sboxLookup } from './sbox';

it('should get sbox value from the right offset', () => {
  expect(sboxLookup(0, 0)).toEqual(0x02080800);
  expect(sboxLookup(7, 0b111111)).toEqual(0x820080);
});
