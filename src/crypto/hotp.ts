import SHA1 from "./sha1.ts";
import HMAC from "./hmac.ts";

/**
 * Class encapsulating HOTP-related methods.
 * 
 * ## Example
 * ```js
 * let key = [0x78, 0x64];
 * let hotp = new HOTP(key, 0);
 * console.log(hotp.value()); // 708047
 * ```
 */
class HOTP {
  key: number[];
  counter: number[];

  constructor(key: number[], counter?: number) {
    this.key = key;

    // Convert the counter into 64-bit big endian bytes
    let counterBuffer = new ArrayBuffer(8);
    let view = new DataView(counterBuffer);
    view.setUint32(4, counter ?? 0);

    this.counter = Array.from(new Uint8Array(counterBuffer));
  }

  /**
   * Calculates the six-digit HOTP value for the given key and counter value.
   * 
   * @returns {number} calculated HOTP value
   */
  value(): number {
    let hash = (bytes: number[]) => new SHA1(bytes).hash();
    let mac = new HMAC(this.key, this.counter, hash).calculate();
    let offset = mac[mac.length - 1] & 0xf;

    // Select the 31 bits to make up the value
    let bits = ((mac[offset] & 0x7f) << 24)
      | ((mac[offset + 1] & 0xff) << 16)
      | ((mac[offset + 2] & 0xff) << 8)
      | (mac[offset + 3] & 0xff);

    // Ensure that the value is six digits
    return bits % 10 ** 6;
  }
}

export default HOTP;