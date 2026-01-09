import { sboxLookup } from './sbox';

export function ror(value : number, bits : number) : number {
  const low = (value >>> bits) & 0xFFFF_FFFF;
  const high = (value << (32 - bits)) & 0xFF_FF_FF_FF;
  return (low | high);
}

function ubfx(value: number, lsb : number, width : number) : number {
  return (value >>> lsb) & ((1 << width) -1);
}


function sboxPass(word1: number, word2: number) : number {
  const bb0 = ubfx(word1, 2, 6);
  const bb1 = ubfx(word1, 10, 6);
  const bb2 = ubfx(word1, 18, 6);
  const bb3 = word1 >>> 26;

  const sb0 = sboxLookup(0, bb0);
  const sb1 = sboxLookup(2, bb1);
  const sb2 = sboxLookup(4, bb2);
  const sb3 = sboxLookup(6, bb3);

  const bc0 = ubfx(word2, 2, 6);
  const bc1 = ubfx(word2, 10, 6);
  const bc2 = ubfx(word2, 18, 6);
  const bc3 = word2 >>> 26;

  const sc0 = sboxLookup(1, bc0);
  const sc1 = sboxLookup(3, bc1);
  const sc2 = sboxLookup(5, bc2);
  const sc3 = sboxLookup(7, bc3);

  return (sb0 ^ sb1 ^ sb2 ^ sb3 ^ sc1 ^ sc2 ^ sc3 ^ sc0);
}

export function unpackBuffer(bvalue: Array<number>) : [number, number] {
  let ret1 = bvalue[0];
  ret1 = ret1 | (bvalue[1]) << 8;
  ret1 = ret1 | (bvalue[2]) << 16
  ret1 = ret1 | (bvalue[3]) << 24;

  let ret2 = bvalue[4];
  ret2 = ret2 | (bvalue[5]) << 8;
  ret2 = ret2 | (bvalue[6]) << 16
  ret2 = ret2 | (bvalue[7]) << 24;

  return [ret1, ret2];
}

export function packBuffer(words: [number, number]) : Array<number> {
  const ret = [0, 0, 0, 0, 0, 0, 0, 0];
  ret[0] = words[0] & 0xFF;
  ret[1] = (words[0] >>> 8) & 0xFF;
  ret[2] = (words[0] >>> 16) & 0xFF;
  ret[3] = (words[0] >>> 24) & 0xFF;

  ret[4] = words[1] & 0xFF;
  ret[5] = (words[1] >>> 8) & 0xFF;
  ret[6] = (words[1] >>> 16) & 0xFF;
  ret[7] = (words[1] >>> 24) & 0xFF;
  
  return ret;
}

export function feistelRound(next_l, next_r, key, keyIdx) : [number, number] {
  let [left, right] = unpackBuffer(key.slice(keyIdx));
  left = left ^ next_l
  right = right ^ next_l
  next_r = next_r ^ sboxPass(left, ror(right, 4));

  [left, right] = unpackBuffer(key.slice(keyIdx + 8));

  left = left ^ next_r;
  right = right ^ next_r;
  next_l = sboxPass(left, ror(right, 4)) ^ next_l;

  return [next_l, next_r];
}
