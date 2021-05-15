/**
 * Class encapsulating SHA-1 related methods.
 * 
 * ## Example
 * ```ts
 * let hasher = new SHA1([0x50, 0x6f, 0x67, 0x43, 0x68, 0x61, 0x6d, 0x70]);
 * let hash = hasher.hash(); // 56aa37b9556127a93cfef75d89bd5c985449efef
 * ```
 */
class SHA1 {
  message: ArrayBuffer;
  messageView: DataView;

  h0: number;
  h1: number;
  h2: number;
  h3: number;
  h4: number;

  constructor(bytes: number[]) {
    // Initialise the byte array with zeroes by calculating its size
    this.message = new ArrayBuffer(Math.ceil((bytes.length * 8 + 72) / 512) * 64);
    this.messageView = new DataView(this.message);

    // Use Merkle–Damgård padding to set the initial byte array values
    for (let i = 0; i < bytes.length; i++) this.messageView.setUint8(i, bytes[i]);
    this.messageView.setUint8(bytes.length, 0x80);
    this.messageView.setUint32(this.messageView.byteLength - 4, bytes.length * 8); // technically should be 64-bit but for this use-case it is not necessary

    // Initialise the default hash component values
    this.h0 = 0x67452301;
    this.h1 = 0xEFCDAB89;
    this.h2 = 0x98BADCFE;
    this.h3 = 0x10325476;
    this.h4 = 0xC3D2E1F0;
  }

  /**
   * Hashes the given bytes using SHA-1.
   * 
   * @returns {number[]} hashed message as bytes
   */
  hash(): number[] {
    // Split the data into chunks
    for (let chunk = 0; chunk < this.message.byteLength / 64; chunk++) {
      // Split the chunk into 16 32-bit unsigned words
      let words = new ArrayBuffer(320);
      let wordsView = new DataView(words);
      for (let i = 0; i < 16; i++) wordsView.setUint32(i * 4, this.messageView.getUint32(chunk * 64 + i * 4));

      // Extend to 80 words
      for (let i = 16; i < 80; i++) {
        let w3 = wordsView.getUint32((i - 3) * 4);
        let w8 = wordsView.getUint32((i - 8) * 4);
        let w14 = wordsView.getUint32((i - 14) * 4);
        let w16 = wordsView.getUint32((i - 16) * 4);

        let w = this.leftRotate(w3 ^ w8 ^ w14 ^ w16, 1);

        wordsView.setUint32(i * 4, w);
      }

      let a = this.h0;
      let b = this.h1;
      let c = this.h2;
      let d = this.h3;
      let e = this.h4;
      let f = 0;
      let k = 0;

      let kValues = [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6];

      // Main loop
      for (let i = 0; i < 80; i++) {
        if (i < 20) {
          f = (b & c) | ((~b) & d);
          k = kValues[0];
        } else if (i < 40) {
          f = b ^ c ^ d;
          k = kValues[1];
        } else if (i < 60) {
          f = (b & c) | (b & d) | (c & d);
          k = kValues[2];
        } else {
          f = b ^ c ^ d;
          k = kValues[3];
        }

        let temp = this.addWrapped(
          this.leftRotate(a, 5), f, e, k, wordsView.getUint32(i * 4)
        );
        e = d;
        d = c;
        c = this.leftRotate(b, 30);
        b = a;
        a = temp;
      }

      this.h0 = this.addWrapped(this.h0, a);
      this.h1 = this.addWrapped(this.h1, b);
      this.h2 = this.addWrapped(this.h2, c);
      this.h3 = this.addWrapped(this.h3, d);
      this.h4 = this.addWrapped(this.h4, e);
    }

    return this.finalise(this.h0, this.h1, this.h2, this.h3, this.h4);
  }

  /**
   * Rotates bits around a 32-bit unsigned integer.
   * Uses the `>>>` operator to ensure JavaScript doesn't sneakily make it signed.
   * 
   * @param {number} u32 - number treated as a 32-bit unsigned integer to bit rotate
   * @param {number} n - number of bits to rotate by
   * @returns {number} result of the bit rotation
   */
  leftRotate(u32: number, n: number): number {
    return (u32 << n | u32 >>> (32 - n)) >>> 0;
  }

  /**
   * Adds numbers, wrapping around like 32-bit unsigned integers.
   * 
   * @param {...number} u32s - numbers treated as 32-bit unsigned integers to add
   * @returns {number} result of the addition
   */
  addWrapped(...u32s: number[]): number {
    let result = 0;
    for (let u32 of u32s) {
      result += u32;
      result %= 2 ** 32;
    }
    return result;
  }

  /**
   * Encodes the given numbers as a byte string.
   * 
   * @param {...number} u32s - numbers treated as 32-bit unsigned integers to convert into bytes
   * @returns {number[]} resultant byte string
   */
  finalise(...u32s: number[]): number[] {
    let result: number[] = [];
    for (let u32 of u32s) result = result.concat([
      (u32 >>> 24) & 0xff, (u32 >>> 16) & 0xff, (u32 >>> 8) & 0xff, u32 & 0xff]);
    return result;
  }
}

export default SHA1;