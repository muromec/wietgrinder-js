
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

