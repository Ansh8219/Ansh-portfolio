/** Joins class names, skipping falsy values. */
export function cn(...inputs) {
  return inputs.flat().filter(Boolean).join(' ')
}
