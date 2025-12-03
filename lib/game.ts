export type RoomMode = "DUAL" | "RANDOM" | "ASC_ONLY";
export type Direction = "ASC" | "DESC" | "NONE";

/** Format a numeric plate number to three digits (e.g. 7 -> 007). */
export function formatPlateNumber(num: number) {
  return num.toString().padStart(3, "0");
}

/**
 * Return the smallest missing number for ascending progress and the largest missing number for descending.
 * When the room is complete the values will be null.
 */
export function calculateNextTargets(foundNumbers: number[]) {
  const set = new Set(foundNumbers);
  let nextAsc: number | null = null;
  let nextDesc: number | null = null;

  for (let i = 0; i <= 999; i++) {
    if (!set.has(i)) {
      nextAsc = i;
      break;
    }
  }

  for (let i = 999; i >= 0; i--) {
    if (!set.has(i)) {
      nextDesc = i;
      break;
    }
  }

  return { nextAsc, nextDesc };
}

/** Choose a random missing number. Returns null when the room is complete. */
export function randomMissingNumber(foundNumbers: number[]) {
  const missing = [] as number[];
  const set = new Set(foundNumbers);
  for (let i = 0; i <= 999; i++) {
    if (!set.has(i)) missing.push(i);
  }
  if (missing.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * missing.length);
  return missing[randomIndex];
}

/** Generate a fake license plate in old and new formats for a given number. */
export function generateExamplePlate(number: number) {
  const letters = () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
    String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
    String.fromCharCode(65 + Math.floor(Math.random() * 26));

  const twoLetters = () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
    String.fromCharCode(65 + Math.floor(Math.random() * 26));

  const formattedNumber = formatPlateNumber(number);
  return {
    oldFormat: `${letters()}${formattedNumber}`,
    newFormat: `${twoLetters()} ${formattedNumber} ${twoLetters()}`
  };
}

/**
 * Resolve the allowed directions for a room mode.
 */
export function allowedDirections(mode: RoomMode): Direction[] {
  if (mode === "DUAL") return ["ASC", "DESC", "NONE"];
  if (mode === "ASC_ONLY") return ["ASC"];
  return ["NONE"];
}
