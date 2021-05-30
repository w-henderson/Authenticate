import SHA1 from "../../src/crypto/sha1";

test("left rotate algorithm works", () => {
  let sha1 = new SHA1([]);

  expect(sha1.leftRotate(0, 10)).toEqual(0);
  expect(sha1.leftRotate(1, 7)).toEqual(0x80);
  expect(sha1.leftRotate(0x80000000, 1)).toEqual(1);
  expect(sha1.leftRotate(0x80000000, 2)).toEqual(2);
  expect(sha1.leftRotate(123, 32)).toEqual(123);
  expect(sha1.leftRotate(8, 31)).toEqual(4);
});

test("wrapped add algorithm works", () => {
  let sha1 = new SHA1([]);

  expect(sha1.addWrapped(3, 4)).toEqual(7);
  expect(sha1.addWrapped(0, 1, 2)).toEqual(3);
  expect(sha1.addWrapped(0xffffffff, 2)).toEqual(1);
  expect(sha1.addWrapped(0xffffffff, 0xffffffff, 3)).toEqual(1);
});

test("u32 to byte string algorithm works", () => {
  let sha1 = new SHA1([]);

  expect(sha1.finalise(1, 2)).toEqual([0, 0, 0, 1, 0, 0, 0, 2]);
  expect(sha1.finalise(1, 2, 3)).toEqual([0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3]);
  expect(sha1.finalise(0xffffffff, 0xffff)).toEqual([0xff, 0xff, 0xff, 0xff, 0, 0, 0xff, 0xff]);
});

test("correctly hashes string 'foo'", () => {
  let inputBytes = [0x66, 0x6f, 0x6f];
  let resultBytes = new SHA1(inputBytes).hash();
  let expectedBytes = [0x0b, 0xee, 0xc7, 0xb5, 0xea, 0x3f, 0x0f, 0xdb, 0xc9, 0x5d, 0x0d, 0xd4, 0x7f, 0x3c, 0x5b, 0xc2, 0x75, 0xda, 0x8a, 0x33];

  expect(resultBytes).toEqual(expectedBytes);
});

test("correctly hashes multi-chunk (>64b) string", () => {
  let inputBytes = new Array(128).fill(0x69);
  let resultBytes = new SHA1(inputBytes).hash();
  let expectedBytes = [0x12, 0xb2, 0x1b, 0xec, 0x7c, 0x75, 0xa2, 0x0f, 0xa8, 0xc5, 0xac, 0xe0, 0x22, 0x17, 0x9a, 0x81, 0x5c, 0xd7, 0x95, 0xa1];

  expect(resultBytes).toEqual(expectedBytes);
});

test("correctly hashes empty string", () => {
  let inputBytes: number[] = [];
  let resultBytes = new SHA1(inputBytes).hash();
  let expectedBytes = [0xda, 0x39, 0xa3, 0xee, 0x5e, 0x6b, 0x4b, 0x0d, 0x32, 0x55, 0xbf, 0xef, 0x95, 0x60, 0x18, 0x90, 0xaf, 0xd8, 0x07, 0x09];
});