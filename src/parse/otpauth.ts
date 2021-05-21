import Base32 from "./base32.ts";

/**
 * Class encapsulating OTPAuth-related parsing methods.
 * Throws errors if parsing fails.
 * 
 * ## Example
 * ```js
 * let url = "otpauth://totp/foo?secret=MZXW6===&issuer=bar";
 * let auth = new OTPAuth(url);
 * 
 * console.log(auth.secret); // [0x66, 0x6f, 0x6f]
 * console.log(auth.label); // foo
 * console.log(auth.issuer); // bar
 * ```
 */
class OTPAuth {
  secret: number[];
  label: string;
  issuer: string;

  constructor(url: string) {
    let type = url.match(/(?<=otpauth:\/\/).*(?=\/)/);
    if (type && type[0] === "totp") {
      let label = url.match(/(?<=\w\/).*(?=\?)/);
      let secretBase32 = url.match(/(?<=secret=).*?(?=(&|$))/);
      let issuer = url.match(/(?<=issuer=).*?(?=(&|$))/);

      if (label && secretBase32 && issuer) {
        // If everything was successfully found, parse and save it
        this.label = decodeURIComponent(label[0]);
        this.issuer = decodeURIComponent(issuer[0]);
        this.secret = new Base32().decode(secretBase32[0]);
      } else {
        throw new Error("Could not parse OTPAuth URL.");
      }
    } else {
      throw new Error("Only supports TOTP codes.");
    }
  }
}

export default OTPAuth;