/**
 * Class encapsulating HMAC-related methods.
 * 
 * ## Example
 * ```js
 * let message = [0x50,0x6f,0x67,0x43,0x68,0x61,0x6d,0x70];
 * let key = [0x78,0x64];
 * let hashFunction = (bytes) => new SHA1(bytes).hash();
 * 
 * let hmac = new HMAC(key, message, hashFunction);
 * console.log(hmac.calculate()); // 6cebebd8c0246a7d11f43a356ad1434446e9746f
 * ```
 */
class HMAC {
  key: number[];
  message: number[];
  blockSize: number;
  outputSize: number;
  hash: (bytes: number[]) => number[];

  constructor(
    key: number[],
    message: number[],
    hash: (bytes: number[]) => number[],
    blockSize?: number,
    outputSize?: number
  ) {
    this.key = key;
    this.message = message;
    this.hash = hash;

    this.blockSize = blockSize ?? 64;
    this.outputSize = outputSize ?? 20;

    // If the key is the wrong size, hash it down or pad it up
    if (this.key.length > this.blockSize) this.key = this.hash(this.key);
    if (this.key.length < this.blockSize) this.key = this.key.concat(Array(this.blockSize - this.key.length).fill(0));
  }

  /**
   * Calculates the HMAC value.
   * 
   * @returns {number[]} calculated HMAC value
   */
  calculate(): number[] {
    let outerPaddedKey = this.key.map(value => value ^ 0x5c); // XORs the key with 0x5c bytes
    let innerPaddedKey = this.key.map(value => value ^ 0x36); // XORs the key with 0x36 bytes
    let innerHash = this.hash(innerPaddedKey.concat(this.message));

    return this.hash(outerPaddedKey.concat(innerHash));
  }
}

export default HMAC;