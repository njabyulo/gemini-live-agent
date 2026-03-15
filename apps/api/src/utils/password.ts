const PASSWORD_SCHEME = "pbkdf2-sha256";
const PASSWORD_ITERATIONS = 10_000;
const PASSWORD_KEY_BYTES = 32;
const PASSWORD_SALT_BYTES = 16;

const encoder = new TextEncoder();

const bytesToHex = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

const hexToBytes = (value: string) => {
  if (value.length % 2 !== 0) {
    throw new Error("Invalid hex input.");
  }

  const bytes = new Uint8Array(value.length / 2);

  for (let index = 0; index < value.length; index += 2) {
    bytes[index / 2] = Number.parseInt(value.slice(index, index + 2), 16);
  }

  return bytes;
};

const constantTimeEqual = (left: Uint8Array, right: Uint8Array) => {
  if (left.length !== right.length) {
    return false;
  }

  let diff = 0;

  for (let index = 0; index < left.length; index += 1) {
    diff |= left[index] ^ right[index];
  }

  return diff === 0;
};

const deriveKey = async (password: string, salt: Uint8Array, iterations: number) => {
  const saltBuffer = new Uint8Array(salt.length);
  saltBuffer.set(salt);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password.normalize("NFKC")),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: saltBuffer,
      iterations,
    },
    keyMaterial,
    PASSWORD_KEY_BYTES * 8,
  );

  return new Uint8Array(bits);
};

const parseHash = (hash: string) => {
  const [scheme, iterationsValue, saltHex, keyHex] = hash.split("$");

  if (
    scheme !== PASSWORD_SCHEME ||
    !iterationsValue ||
    !saltHex ||
    !keyHex
  ) {
    throw new Error("Unsupported password hash format.");
  }

  const iterations = Number.parseInt(iterationsValue, 10);

  if (!Number.isFinite(iterations) || iterations <= 0) {
    throw new Error("Invalid password hash iterations.");
  }

  return {
    iterations,
    salt: hexToBytes(saltHex),
    key: hexToBytes(keyHex),
  };
};

export const hashWorkerPassword = async (password: string) => {
  const salt = crypto.getRandomValues(new Uint8Array(PASSWORD_SALT_BYTES));
  const key = await deriveKey(password, salt, PASSWORD_ITERATIONS);

  return `${PASSWORD_SCHEME}$${PASSWORD_ITERATIONS}$${bytesToHex(salt)}$${bytesToHex(key)}`;
};

export const verifyWorkerPassword = async ({
  hash,
  password,
}: {
  hash: string;
  password: string;
}) => {
  try {
    const parsed = parseHash(hash);
    const derived = await deriveKey(password, parsed.salt, parsed.iterations);

    return constantTimeEqual(derived, parsed.key);
  } catch {
    return false;
  }
};
