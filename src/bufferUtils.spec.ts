import { it, expect } from 'vitest';
import { packBuffer, unpackBuffer } from './bufferUtils';

it('should unpack two little endian uint32 values from buffer', () => {
  const block = [1,2,3,4,5,6,7,8];
  const [one, two] = unpackBuffer(block);
  expect(one).toEqual(0x4030201);
  expect(two).toEqual(0x8070605);
});

it('should pack two numbers as 32 bit LE', () => {
  const block = packBuffer([0x4030201, 0x8070605]);
  expect(block).toEqual([1,2,3,4,5,6,7,8]);
});
