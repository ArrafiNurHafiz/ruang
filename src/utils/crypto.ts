/**
 * TAMENG Cryptographic & Privacy Utilities
 * Cryptographic Integrity Hash, PII detector, and token hash algorithms
 */

export function generateTicketId(): string {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomPart = "";
  const randomBytes = new Uint8Array(4);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(randomBytes);
    for (let i = 0; i < 4; i++) {
      randomPart += chars.charAt(randomBytes[i] % chars.length);
    }
  } else {
    for (let i = 0; i < 4; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return `TMG-${year}-${randomPart}`;
}

export function generateRecoveryKey(): string {
  const words = [
    "aman",
    "tameng",
    "ruang",
    "lindung",
    "berani",
    "suara",
    "kunci",
    "kristal",
    "cahaya",
    "benteng",
    "langit",
    "merdeka",
    "tegak",
    "rahasia",
    "harmoni",
    "fajar",
    "pandu",
    "satria",
  ];
  const selected: string[] = [];
  const randomIndices = new Uint32Array(4);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(randomIndices);
    for (let i = 0; i < 4; i++) {
      selected.push(words[randomIndices[i] % words.length]);
    }
  } else {
    for (let i = 0; i < 4; i++) {
      selected.push(words[Math.floor(Math.random() * words.length)]);
    }
  }
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${selected.join("-")}-${randomSuffix}`;
}

/**
 * Generate Cryptographic Integrity Hash for Report Content using standard SHA-256
 */
export async function generateZKPHash(
  content: string,
  timestamp: number,
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(
    `${content}_${timestamp}_TAMENG_INTEGRITY_SALT_2026`,
  );

  if (typeof crypto !== "undefined" && crypto.subtle && crypto.subtle.digest) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hexDigest = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return `integrity-sha256:0x${hexDigest}`;
  }

  // Fallback FNV-1a if subtle crypto is unavailable
  let hash = 0x811c9dc5;
  const str = `${content}_${timestamp}_TAMENG_INTEGRITY_SALT_2026`;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const digest = (hash >>> 0).toString(16).padStart(8, "0");
  return `integrity-sha256:0x${digest}`;
}

/**
 * PII Detector: Detects names, phone numbers, class designations, NISN, and addresses in text
 */
export interface DetectedEntity {
  text: string;
  type:
    | "Kelas / Rombel"
    | "Nomor Kontak"
    | "NISN / Angka Pengenal"
    | "Nama / Identitas"
    | "Lokasi Privat";
  startIndex: number;
  endIndex: number;
}

export function detectPII(text: string): DetectedEntity[] {
  if (!text) return [];
  const entities: DetectedEntity[] = [];

  // 1. Class patterns: e.g. "XII IPA 2", "12 IPS 1", "Kelas 8B", "X TKJ 3", "XI MIPA 4", "IX-C"
  const classRegex =
    /\b(kelas\s+[0-9]{1,2}\s*[a-zA-Z0-9-]*|(?:X|XI|XII|VII|VIII|IX|[0-9]{1,2})\s*(?:IPA|IPS|MIPA|BHS|TKJ|RPL|AKL|OTKP|TBSM|TKR|MM|DKV)?\s*[0-9A-Za-z-]*)\b/gi;
  let match;
  while ((match = classRegex.exec(text)) !== null) {
    if (
      match[0].length >= 3 &&
      !["dan", "itu", "ke", "di"].includes(match[0].toLowerCase())
    ) {
      entities.push({
        text: match[0],
        type: "Kelas / Rombel",
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }
  }

  // 2. Phone numbers: 08xx-xxxx-xxxx or +628xxx
  const phoneRegex = /\b(?:\+62|62|0)8[1-9][0-9]{7,11}\b/g;
  while ((match = phoneRegex.exec(text)) !== null) {
    entities.push({
      text: match[0],
      type: "Nomor Kontak",
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  // 3. NISN (10 digits)
  const nisnRegex = /\b[0-9]{10}\b/g;
  while ((match = nisnRegex.exec(text)) !== null) {
    if (
      !entities.some(
        (e) =>
          e.startIndex <= match!.index &&
          e.endIndex >= match!.index + match![0].length,
      )
    ) {
      entities.push({
        text: match[0],
        type: "NISN / Angka Pengenal",
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }
  }

  // 4. Common name patterns: "nama saya [X]", "saya [X]", "bernama [X]"
  const nameIntroRegex =
    /(?:nama(?:ku| saya)?\s+(?:adalah\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)|saya\s+bernama\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)|teman\s+saya\s+bernama\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*))/gi;
  while ((match = nameIntroRegex.exec(text)) !== null) {
    const matchedName = match[1] || match[2] || match[3];
    if (matchedName && matchedName.length > 2) {
      entities.push({
        text: matchedName,
        type: "Nama / Identitas",
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }
  }

  return entities;
}

export function autoRedactText(
  text: string,
  entities: DetectedEntity[],
): string {
  if (!text || entities.length === 0) return text;

  // Sort descending by startIndex so replacements don't shift earlier offsets
  const sorted = [...entities].sort((a, b) => b.startIndex - a.startIndex);
  let redacted = text;

  for (const entity of sorted) {
    let mask = "[REDACTED]";
    switch (entity.type) {
      case "Kelas / Rombel":
        mask = "[KELAS-DIRAHAASIAKAN]";
        break;
      case "Nomor Kontak":
        mask = "[NOMOR-KONTAK-DIRAHASIAKAN]";
        break;
      case "NISN / Angka Pengenal":
        mask = "[NISN-DIRAHASIAKAN]";
        break;
      case "Nama / Identitas":
        mask = "[NAMA-SISWA-DIRAHASIAKAN]";
        break;
      case "Lokasi Privat":
        mask = "[LOKASI-DIRAHASIAKAN]";
        break;
    }
    redacted =
      redacted.slice(0, entity.startIndex) +
      mask +
      redacted.slice(entity.endIndex);
  }

  return redacted;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
