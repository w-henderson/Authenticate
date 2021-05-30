import Base32 from "../../src/parse/base32";

test("correctly encodes into base32", () => {
  let base32 = new Base32();

  expect(base32.encode([0x66, 0x6f, 0x6f])).toEqual("MZXW6===");
  expect(base32.encode([0x62, 0x61, 0x72])).toEqual("MJQXE===");
  expect(base32.encode([0x68, 0x65, 0x6c, 0x6c, 0x6f])).toEqual("NBSWY3DP");
  expect(base32.encode([0x70, 0x6f, 0x67, 0x67, 0x65, 0x72, 0x73])).toEqual("OBXWOZ3FOJZQ====");
});

test("correctly decodes from base32", () => {
  let base32 = new Base32();

  expect(base32.decode("MZXW6===")).toEqual([0x66, 0x6f, 0x6f]);
  expect(base32.decode("MJQXE===")).toEqual([0x62, 0x61, 0x72]);
  expect(base32.decode("NBSWY3DP")).toEqual([0x68, 0x65, 0x6c, 0x6c, 0x6f]);
  expect(base32.decode("OBXWOZ3FOJZQ====")).toEqual([0x70, 0x6f, 0x67, 0x67, 0x65, 0x72, 0x73]);
});

test("correctly decodes from base32 without padding", () => {
  let base32 = new Base32();

  expect(base32.decode("MZXW6")).toEqual([0x66, 0x6f, 0x6f]);
  expect(base32.decode("MJQXE")).toEqual([0x62, 0x61, 0x72]);
  expect(base32.decode("NBSWY3DP")).toEqual([0x68, 0x65, 0x6c, 0x6c, 0x6f]);
  expect(base32.decode("OBXWOZ3FOJZQ")).toEqual([0x70, 0x6f, 0x67, 0x67, 0x65, 0x72, 0x73]);
})