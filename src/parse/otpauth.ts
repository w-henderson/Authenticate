import Base32 from "./base32";
import 'url-search-params-polyfill';

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
  digits: number;
  period: number;
  algorithm: string;

  constructor(url: string) {
    let type = url.match(/otpauth:\/\/.*(?=\/)/);
    let paramsRaw = url.match(/otpauth:\/\/totp\/.*/);
    if (type && type[0] === "otpauth://totp" && paramsRaw) {
      let [label, paramString] = paramsRaw[0].substr(15).split("?");
      let params = new URLSearchParams(paramString);

      let splitLabel = decodeURIComponent(label).split(":");

      let secret = params.get("secret");
      let issuer = splitLabel.length > 1 ? splitLabel[0] : params.get("issuer") || "";
      let algorithm = params.get("algorithm") || "SHA1";
      let digits = parseInt(params.get("digits") || "NaN") || 6;
      let period = parseInt(params.get("period") || "NaN") || 30;

      if (secret) {
        // If everything was successfully found, parse and save it
        this.label = splitLabel.length > 1 ? splitLabel[1] : splitLabel[0];
        this.secret = new Base32().decode(secret);
        this.issuer = issuer;
        this.algorithm = algorithm;
        this.digits = digits;
        this.period = period;
      } else {
        throw new Error("OTPAuth URLs must include a secret.");
      }
    } else {
      throw new Error("Only supports TOTP codes.");
    }
  }

  static fromParams(params: {
    secret: number[],
    label: string,
    issuer: string,
    digits: number,
    period: number,
    algorithm: string
  }) {
    let object: OTPAuth = Object.create(this.prototype);
    return Object.assign(object, params);
  }
}

export default OTPAuth;