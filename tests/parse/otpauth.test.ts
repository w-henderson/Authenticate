import OTPAuth from "../../src/parse/otpauth";

test("parses url with everything specified", () => {
  let url = "otpauth://totp/foo:bar?secret=MZXW6&issuer=foo&algorithm=SHA1&digits=6&period=30";
  let auth = new OTPAuth(url);

  expect(auth.algorithm).toEqual("SHA1");
  expect(auth.digits).toEqual(6);
  expect(auth.issuer).toEqual("foo");
  expect(auth.label).toEqual("bar");
  expect(auth.period).toEqual(30);
  expect(auth.secret).toEqual([0x66, 0x6f, 0x6f]);
});

test("parses url where colon is uri-encoded", () => {
  let url = "otpauth://totp/foo%3Abar?secret=MZXW6&issuer=foo&algorithm=SHA1&digits=6&period=30";
  let auth = new OTPAuth(url);

  expect(auth.algorithm).toEqual("SHA1");
  expect(auth.digits).toEqual(6);
  expect(auth.issuer).toEqual("foo");
  expect(auth.label).toEqual("bar");
  expect(auth.period).toEqual(30);
  expect(auth.secret).toEqual([0x66, 0x6f, 0x6f]);
})

test("parses url with defaults", () => {
  let url = "otpauth://totp/?secret=MZXW6";
  let auth = new OTPAuth(url);

  expect(auth.algorithm).toEqual("SHA1");
  expect(auth.digits).toEqual(6);
  expect(auth.issuer).toEqual("");
  expect(auth.label).toEqual("");
  expect(auth.period).toEqual(30);
  expect(auth.secret).toEqual([0x66, 0x6f, 0x6f]);
})

test("errors when given unsupported hotp code", () => {
  let url = "otpauth://hotp/?secret=MZXW6&counter=0";
  expect(() => new OTPAuth(url)).toThrow("Only supports TOTP codes.");
});

test("errors when not given a secret", () => {
  let url = "otpauth://totp/?issuer=issuer";
  expect(() => new OTPAuth(url)).toThrow("OTPAuth URLs must include a secret.");
})