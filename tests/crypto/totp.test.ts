import TOTP from "../../src/crypto/totp";

test("calculates a valid totp value without erroring", () => {
  let totp = new TOTP([0x78, 0x64]);

  expect(() => totp.value()).not.toThrow();
  expect(totp.value()).toBeLessThan(1e6);
  expect(totp.value()).toBeGreaterThanOrEqual(0);
});

test("calculates valid time until update without erroring", () => {
  let totp = new TOTP([0x78, 0x64]);

  expect(() => totp.timeUntilUpdate()).not.toThrow();
  expect(totp.timeUntilUpdate()).toBeLessThanOrEqual(totp.interval * 1000);
})