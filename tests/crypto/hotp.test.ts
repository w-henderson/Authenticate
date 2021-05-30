import HOTP from "../../src/crypto/hotp";

test("calculates the correct hotp value with unspecified counter", () => {
  let hotp = new HOTP([0x66, 0x6f, 0x6f]);
  expect(hotp.value()).toEqual(937425);
})

test("calculates the correct hotp value with specified counter", () => {
  let hotp = new HOTP([0x66, 0x6f, 0x6f], 1);
  expect(hotp.value()).toEqual(398408);
})