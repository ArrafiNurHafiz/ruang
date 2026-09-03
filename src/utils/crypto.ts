/**
 * TAMENG Cryptographic & Privacy Utilities
 * Zero-Knowledge Proof simulator, PII detector, and token hash algorithms
 */

export function generateTicketId(): string {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomPart = "";
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
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
  for (let i = 0; i < 4; i++) {
    const idx = Math.floor(Math.random() * words.length);
    selected.push(words[idx]);
  }
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${selected.join("-")}-${randomSuffix}`;
}

/**
 * Generate simulated Zero-Knowledge Proof (ZKP) cryptographic digest
 */
export function generateZKPHash(content: string, timestamp: number): string {
  let hash = 0;
  const str = content + timestamp + "TAMENG_ZKP_SALT_2025";
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  const randHex1 = Math.random().toString(16).substring(2, 10);
  const randHex2 = Math.random().toString(16).substring(2, 10);
  return `zkp-sha256:0x${hex}${randHex1}${randHex2}`;
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
    // Avoid if it's part of a phone match
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

  // 4. Common name patterns or intro prefixes: "nama saya [X]", "saya [X]", "bernama [X]", "dipanggil [X]"
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

  // 5. Address markers: "jl.", "jalan", "komplek", "rt/rw"
  const addressRegex =
    /\b(?:jl\.|jalan|komplek|gang|gg\.|rt\s*\d+\s*\/|rw\s*\d+)\s+[A-Za-z0-9\s.,-]+?(?=(?:,|\.|\n|$))/gi;
  while ((match = addressRegex.exec(text)) !== null) {
    if (match[0].length > 5) {
      entities.push({
        text: match[0],
        type: "Lokasi Privat",
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }
  }

  // Filter overlapping entities
  return entities.filter(
    (v, i, a) =>
      a.findIndex((t) => t.text === v.text && t.startIndex === v.startIndex) ===
      i,
  );
}

/**
 * Redacts detected PII in text replacing them with [SENSOR: Tipe]
 */
export function autoRedactText(
  text: string,
  entities: DetectedEntity[],
): string {
  if (!text || entities.length === 0) return text;

  // Sort entities descending by index so replacing doesn't mess up offsets
  const sorted = [...entities].sort((a, b) => b.startIndex - a.startIndex);
  let result = text;

  for (const item of sorted) {
    const replacement = `[TERLINDUNGI: ${item.type.toUpperCase()}]`;
    result =
      result.substring(0, item.startIndex) +
      replacement +
      result.substring(item.endIndex);
  }

  return result;
}

/**
 * Format bytes to readable string (e.g. 1.2 MB)
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
