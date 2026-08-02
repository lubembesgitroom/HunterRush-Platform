const encoder = new TextEncoder();

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function rightRotate(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

function sha256Bytes(input: Uint8Array): Uint8Array {
  const bytes = input;
  const bitLength = bytes.length * 8;
  const paddingLength = ((bytes.length + 9 + 63) >> 6) << 6;
  const padded = new Uint8Array(paddingLength);

  padded.set(bytes, 0);
  padded[bytes.length] = 0x80;

  const lengthBytes = new Uint8Array(8);
  for (let i = 0; i < 8; i += 1) {
    lengthBytes[7 - i] = (bitLength >>> (i * 8)) & 0xff;
  }

  padded.set(lengthBytes, paddingLength - 8);

  const h = [
    0x6a09e667,
    0xbb67ae85,
    0x3c6ef372,
    0xa54ff53a,
    0x510e527f,
    0x9b05688c,
    0x1f83d9ab,
    0x5be0cd19,
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
    0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
    0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
    0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
    0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  for (let offset = 0; offset < padded.length; offset += 64) {
    const chunk = padded.subarray(offset, offset + 64);
    const w = new Uint32Array(64);

    for (let i = 0; i < 16; i += 1) {
      const start = i * 4;
      const byte0 = chunk[start];
      const byte1 = chunk[start + 1];
      const byte2 = chunk[start + 2];
      const byte3 = chunk[start + 3];

      if (byte0 === undefined || byte1 === undefined || byte2 === undefined || byte3 === undefined) {
        continue;
      }

      w[i] = ((byte0 << 24) >>> 0) |
        ((byte1 << 16) >>> 0) |
        ((byte2 << 8) >>> 0) |
        byte3;
    }

    for (let i = 16; i < 64; i += 1) {
      const previous1 = w[i - 15];
      const previous2 = w[i - 2];
      const previous3 = w[i - 16];
      const previous4 = w[i - 7];

      if (previous1 === undefined || previous2 === undefined || previous3 === undefined || previous4 === undefined) {
        continue;
      }

      const s0 = rightRotate(previous1, 7) ^ rightRotate(previous1, 18) ^ (previous1 >>> 3);
      const s1 = rightRotate(previous2, 17) ^ rightRotate(previous2, 19) ^ (previous2 >>> 10);
      w[i] = (previous3 + s0 + previous4 + s1) >>> 0;
    }

    let a = h[0];
    let b = h[1];
    let c = h[2];
    let d = h[3];
    let e = h[4];
    let f = h[5];
    let g = h[6];
    let iH = h[7];

    for (let i = 0; i < 64; i += 1) {
      const currentE = e;
      const currentF = f;
      const currentG = g;
      const currentA = a;
      const currentB = b;
      const currentC = c;
      const currentD = d;
      const currentIH = iH;

      if (
        currentE === undefined ||
        currentF === undefined ||
        currentG === undefined ||
        currentA === undefined ||
        currentB === undefined ||
        currentC === undefined ||
        currentD === undefined ||
        currentIH === undefined
      ) {
        continue;
      }

      const s1 = rightRotate(currentE, 6) ^ rightRotate(currentE, 11) ^ rightRotate(currentE, 25);
      const ch = (currentE & currentF) ^ (~currentE & currentG);
      const temp1 = (currentIH + s1 + ch + (k[i] ?? 0) + (w[i] ?? 0)) >>> 0;
      const s0 = rightRotate(currentA, 2) ^ rightRotate(currentA, 13) ^ rightRotate(currentA, 22);
      const maj = (currentA & currentB) ^ (currentA & currentC) ^ (currentB & currentC);
      const temp2 = (s0 + maj) >>> 0;

      iH = currentG;
      g = currentF;
      f = currentE;
      e = (currentD + temp1) >>> 0;
      d = currentC;
      c = currentB;
      b = currentA;
      a = (temp1 + temp2) >>> 0;
    }

    const hash0 = h[0];
    const hash1 = h[1];
    const hash2 = h[2];
    const hash3 = h[3];
    const hash4 = h[4];
    const hash5 = h[5];
    const hash6 = h[6];
    const hash7 = h[7];

    if (
      hash0 === undefined ||
      hash1 === undefined ||
      hash2 === undefined ||
      hash3 === undefined ||
      hash4 === undefined ||
      hash5 === undefined ||
      hash6 === undefined ||
      hash7 === undefined
    ) {
      continue;
    }

    h[0] = (hash0 + (a ?? 0)) >>> 0;
    h[1] = (hash1 + (b ?? 0)) >>> 0;
    h[2] = (hash2 + (c ?? 0)) >>> 0;
    h[3] = (hash3 + (d ?? 0)) >>> 0;
    h[4] = (hash4 + (e ?? 0)) >>> 0;
    h[5] = (hash5 + (f ?? 0)) >>> 0;
    h[6] = (hash6 + (g ?? 0)) >>> 0;
    h[7] = (hash7 + (iH ?? 0)) >>> 0;
  }

  return new Uint8Array(
    h.flatMap((value) => [
      (value >>> 24) & 0xff,
      (value >>> 16) & 0xff,
      (value >>> 8) & 0xff,
      value & 0xff,
    ]),
  );
}

export function sha256Hex(input: string): string {
  return toHex(sha256Bytes(encoder.encode(input)));
}

export function hmacSha256(key: string, data: string): string {
  const keyBytes = encoder.encode(key);
  const dataBytes = encoder.encode(data);
  const block = new Uint8Array(64);

  if (keyBytes.length > 64) {
    const hash = sha256Bytes(keyBytes);
    block.set(hash, 0);
  } else {
    block.set(keyBytes, 0);
  }

  const inner = new Uint8Array(64 + dataBytes.length);
  const outer = new Uint8Array(64 + 32);

  for (let i = 0; i < 64; i += 1) {
    const blockByte = block[i];
    if (blockByte !== undefined) {
      inner[i] = blockByte ^ 0x36;
      outer[i] = blockByte ^ 0x5c;
    }
  }

  inner.set(dataBytes, 64);
  outer.set(sha256Bytes(inner), 64);

  return toHex(sha256Bytes(outer));
}

export function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);

  if (typeof globalThis.crypto?.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(bytes);
    return bytes;
  }

  for (let i = 0; i < length; i += 1) {
    bytes[i] = Math.floor(Math.random() * 256);
  }

  return bytes;
}

export function randomHex(length: number): string {
  return toHex(randomBytes(length));
}
