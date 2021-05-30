import HMAC from "../../src/crypto/hmac";
import SHA1 from "../../src/crypto/sha1";

test("calculates hmac value for message 'foo' and key 'bar'", () => {
  let message = [0x66, 0x6f, 0x6f];
  let key = [0x62, 0x61, 0x72];
  let hashFunction = (bytes: number[]) => new SHA1(bytes).hash();
  let expectedHmacValue = [0x85, 0xd1, 0x55, 0xc5, 0x5e, 0xd2, 0x86, 0xa3, 0x00, 0xbd, 0x1c, 0xf1, 0x24, 0xde, 0x08, 0xd8, 0x7e, 0x91, 0x4f, 0x3a];

  let hmac = new HMAC(key, message, hashFunction);
  let resultHmacValue = hmac.calculate();

  expect(resultHmacValue).toEqual(expectedHmacValue);
})

test("calculates hmac value for longer key", () => {
  let message = [0x66, 0x6f, 0x6f];
  let key = new Array(128).fill(0x69);
  let hashFunction = (bytes: number[]) => new SHA1(bytes).hash();
  let expectedHmacValue = [0x98, 0x30, 0x98, 0xc1, 0xf4, 0x04, 0x04, 0x95, 0x53, 0xd3, 0xbf, 0x30, 0xe1, 0xbd, 0xb0, 0x88, 0x34, 0x00, 0xf4, 0x6b];

  let hmac = new HMAC(key, message, hashFunction);
  let resultHmacValue = hmac.calculate();

  expect(resultHmacValue).toEqual(expectedHmacValue);
})

test("calculates hmac value for block-sized key", () => {
  let message = [0x66, 0x6f, 0x6f];
  let key = new Array(64).fill(0x69);
  let hashFunction = (bytes: number[]) => new SHA1(bytes).hash();
  let expectedHmacValue = [0xc3, 0x72, 0x31, 0xe3, 0x2c, 0xe1, 0xde, 0x40, 0xc1, 0x2b, 0x5f, 0x98, 0x21, 0x09, 0x5e, 0x4f, 0xf3, 0x55, 0x46, 0xc4];

  let hmac = new HMAC(key, message, hashFunction);
  let resultHmacValue = hmac.calculate();

  expect(resultHmacValue).toEqual(expectedHmacValue);
});