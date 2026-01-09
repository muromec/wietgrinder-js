import { it, expect } from 'vitest';
import { encryptBlock } from './cipher';

it('should process one block', () => {
  const blockClear = [0, 1, 2, 3, 4, 5, 6, 7];
  const key = new Array(128);
  for(let i = 0; i < 128; i++) {
    key[i] = 0xFF & (i | i << 8) ^ 0x33;
  }
  const blockCipher = encryptBlock(blockClear, key);
  expect(blockCipher).toEqual([
    0x97, 0x6c, 0x9f, 0xdb, 0xa1, 0x8f, 0x2d, 0xc2
  ]);
});
