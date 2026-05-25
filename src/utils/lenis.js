/** Shared Lenis instance for imperative scroll helpers (e.g. nav links). */
let lenisInstance = null

export function setLenisInstance(instance) {
  lenisInstance = instance
}

export function getLenisInstance() {
  return lenisInstance
}
