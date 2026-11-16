/**
 * Shared by the Approach (TV zoom) and Work sections, which hand over to each other.
 * ZOOM_SCROLL: how many viewport heights of scrolling the zoom into the TV takes. Short on purpose: quick zoom,
 * and the Work stage is already fading in underneath it, so the screen is never empty.
 */
export const ZOOM_SCROLL = 0.32
// Work content is fully in when the zoom ends; it starts to fade in this share of the way through the zoom.
export const HANDOFF_FROM = 0.5
