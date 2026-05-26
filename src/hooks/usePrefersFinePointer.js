import { useMediaQuery } from './useMediaQuery'

/** True when the primary input supports hover (desktop mouse/trackpad). */
export function usePrefersFinePointer() {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}
