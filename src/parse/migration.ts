import OTPAuth from "./otpauth";

/**
 * Class encapsulating OTPMigration-related parsing methods.
 * Implementation structure from https://gist.github.com/klustic/5d6c4f44f28c6fe5168c81849f027413.
 * 
 * ## Example
 * ```js
 * let url = "otpauth-migration://offline?data=CioKCkhpLCBBbmR...";
 * let migration = new OTPMigration(url);
 * 
 * console.log(migration.codes[0].secret); // [0x66, 0x6f, 0x6f]
 * console.log(migration.codes[0].label); // foo
 * console.log(migration.codes[0].issuer); // bar
 * ```
 */
class OTPMigration {
  codes: OTPAuth[];

  constructor(uri: string) {
    this.codes = [];

    let base64Data = decodeURIComponent(uri.split("=")[1]);
    let data = Buffer.from(base64Data, "base64");
    let index = 0;

    let consume = (i: number) => {
      let length = data[i];
      return {
        data: data.slice(i + 1, i + length + 1),
        length: length + 2
      };
    }

    while (index < data.length - 3) {
      index += 3;
      let { data: secret, length: length1 } = consume(index);
      let { data: label, length: length2 } = consume(index + length1);
      let { data: issuer, length: length3 } = consume(index + length1 + length2);
      index += length1 + length2 + length3 + 5;

      this.codes.push(OTPAuth.fromParams({
        secret: [...secret],
        label: label.toString(),
        issuer: issuer.toString(),
        digits: 6,
        period: 30,
        algorithm: "SHA1"
      }));
    }
  }
}

export default OTPMigration;