/**
 * Class encapsulating Base32 encoding/decoding methods.
 * 
 * ## Example
 * ```js
 * let base32 = new Base32();
 * console.log(base32.encode([0x66, 0x6f, 0x6f])); // MZXW6===
 * console.log(base32.decode("MZXW6===")); // [0x66, 0x6f, 0x6f]
 * ```
 */
class Base32 {
  alphabet: string;
  padding: string;

  constructor() {
    // Initialise according to RFC 4648 (https://tools.ietf.org/html/rfc4648)
    // This could be changed to an alternative implementation such as z-base-32.
    this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    this.padding = "=";
  }

  /**
   * Encodes bytes into Base32.
   * 
   * @param {number[]} bytes - bytes to encode into Base32
   * @returns {string} Base32-encoded string
   */
  encode(bytes: number[]): string {
    // Convert byte array to bit array, inefficient but easier and more readable than bitwise magic
    let masks = [0x80, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01];
    let bits = bytes.flatMap(byte => masks.map((mask, index) => (byte & mask) >>> 7 - index));
    let result = "";

    // Main loop for each group of 40 bits
    while (bits.length >= 40) {
      for (let i = 0; i < 40; i += 5) {
        let alphabetIndex = bits[i] << 4 | bits[i + 1] << 3 | bits[i + 2] << 2 | bits[i + 3] << 1 | bits[i + 4];
        result += this.alphabet[alphabetIndex];
      }
      bits.splice(0, 40);
    }

    // Calculate padding
    let paddings: any = { 0: 0, 8: 6, 16: 4, 24: 3, 32: 1 };
    let padding: number = paddings[bits.length];

    // Process remaining bits
    while (bits.length % 5 !== 0) bits.push(0);
    for (let i = 0; i < bits.length; i += 5) result +=
      this.alphabet[bits[i] << 4 | bits[i + 1] << 3 | bits[i + 2] << 2 | bits[i + 3] << 1 | bits[i + 4]];
    result += this.padding.repeat(padding);

    return result;
  }

  /**
   * Decodes a Base32-encoded string back into bytes.
   * 
   * @param {string} base32 - Base32-encoded string
   * @returns {number[]} decoded bytes
   */
  decode(base32: string): number[] {
    // Decode into a bit array
    let decodedBits: number[] = [];
    for (let char of base32) {
      let index = this.alphabet.indexOf(char);
      if (index !== -1) decodedBits = decodedBits.concat([index >>> 4 & 1, index >>> 3 & 1, index >>> 2 & 1, index >>> 1 & 1, index & 1])
    }

    // Calculate how many bits to ignore based on the padding and ignore them
    let ignoredBits: any = { 0: 0, 1: 3, 3: 1, 4: 4, 6: 2 };
    let ignoredBit = ignoredBits[(base32.match(/=/g) || []).length];
    decodedBits.splice(decodedBits.length - ignoredBit);

    // Return bit array to byte array
    let result: number[] = [];
    for (let i = 0; i < decodedBits.length; i += 8)
      result.push(decodedBits[i] << 7
        | decodedBits[i + 1] << 6
        | decodedBits[i + 2] << 5
        | decodedBits[i + 3] << 4
        | decodedBits[i + 4] << 3
        | decodedBits[i + 5] << 2
        | decodedBits[i + 6] << 1
        | decodedBits[i + 7]);

    return result;
  }
}

export default Base32;