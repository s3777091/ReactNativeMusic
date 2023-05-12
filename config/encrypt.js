import { SHA256, HmacSHA512, enc } from 'crypto-js';

const getHash256 = (a) => {
  return SHA256(a).toString(enc.Hex);
}

const getHmac512 = (str, key) => {
  return HmacSHA512(str, key).toString(enc.Hex);
}

export { getHash256, getHmac512 };