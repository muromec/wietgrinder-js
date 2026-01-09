import { feistelRound, unpackBuffer, packBuffer, ror } from './feistel';

function prepare(half_r : number, half_l : number) : [number, number] {
  
  const mixed_halfs = (half_r) ^ (half_l >>> 4)

  const w001 = 0x0F0F_0F0F & mixed_halfs
  const w002 = w001 ^ half_r
  const w003 = 0xFF_FF_FF_FF & (half_l ^ (w001 << 4))
  const w004 = w003 ^ w002 >>> 16
  const w005 = w004 & 0xFFFF
  const w006 = w002 ^ ((w005 << 16) & 0xFFFF0000)
  const w007 = w005 ^ w003
  const w008 = 0x33333333 & (w006 ^ w007 >>> 2)
  const w009 = w008 ^ w006
  const w010 = 0xFFFF_FFFF & (w007 ^ (w008 << 2))
  const w011 = 0x00_FF_00_FF & (w010 ^ (w009 >>> 8))
  const w012 = w011 ^ w010
  const w013 = 0xFFFF_FFFF & (w009 ^ (w011  << 8))
  const w014 = 0x5555_5555 & (w013 ^ (w012 >>> 1))
  const w015 = 0xFFFF_FFFF & (w014 << 1)

  const r = ror(w014 ^ w013, 29)
  const l = ror(w015 ^ w012, 29)

  return [r, l];
}


function finalize(next_r : number, next_l : number) : [number, number] {
  const w001 = ror(next_r, 3)
  const w002 = ror(next_l, 3)
  const w003 = 0x55555555 & ((w002 >>> 1) ^ w001)
  const w004 = w003 ^ w001
  const w005 = (w003 << 1) & 0xFF_FF_FF_FF
  const w006 = w005 ^ w002
  const w007 = 0x00ff_00ff & (w006 ^ (w004 >>> 8))
  const w008 = w007 ^ w006
  const w009 = 0xFFFF_FFFF & (w004 ^ (w007 << 8))
  const w010 = 0x3333_3333 & (w009 ^ (w008  >>> 2))
  const w011 = w010 ^ w009
  const w012 = w008 ^ (w010 << 2) & 0xFFFF_FFFF
  const w013 = w012 ^ w011 >>> 16
  const w014 = w013 & 0xffff
  const w015 = w014 ^ w012
  const w016 = w011 ^ ((w014 << 16) & 0xFF_FF_00_00)
  const w017 = 0xf0f0f0f & (w016 ^ w015 >>> 4)

  const r = w017 ^ w016
  const l = w015 ^ (w017 << 4) & 0xFFFF_FFFF

  return [r, l];
}


export function encryptBlock(block, key): Array<number> {
  let key_offset = 0
  let key_len = key.length;

  const [clear_r, clear_l] = unpackBuffer(block);
  let [next_l, next_r] = prepare(clear_r, clear_l)

  while (key_offset < key_len) {
    [next_l, next_r] = feistelRound(next_l, next_r, key, key_offset)
    key_offset += 16
  }

  [next_r, next_l] = finalize(next_r, next_l)
  return packBuffer([next_r, next_l]);
}
