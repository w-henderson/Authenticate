import OTPMigration from "../../src/parse/migration";
import Base32 from "../../src/parse/base32";

test("parses url with two codes", () => {
  let url = "otpauth-migration://offline?data=CioKCkhpLCBBbmRyZXMSBkFuZHJlcxoOU29tZSBTZXJ2aWNlIDEgASgBMAIKKQoKTm90IFNvIEJhZBIFS2V2aW4aDlNvbWUgU2VydmljZSAyIAEoATACEAE%3D";
  let migration = new OTPMigration(url);

  expect(migration.codes).toHaveLength(2);

  expect(migration.codes[0].issuer).toEqual("Some Service 1");
  expect(migration.codes[0].label).toEqual("Andres");
  expect(migration.codes[0].secret).toEqual(new Base32().decode("JBUSYICBNZSHEZLT"));
  expect(migration.codes[0].digits).toEqual(6);
  expect(migration.codes[0].period).toEqual(30);
  expect(migration.codes[0].algorithm).toEqual("SHA1");

  expect(migration.codes[1].issuer).toEqual("Some Service 2");
  expect(migration.codes[1].label).toEqual("Kevin");
  expect(migration.codes[1].secret).toEqual(new Base32().decode("JZXXIICTN4QEEYLE"));
  expect(migration.codes[0].digits).toEqual(6);
  expect(migration.codes[0].period).toEqual(30);
  expect(migration.codes[0].algorithm).toEqual("SHA1");
})