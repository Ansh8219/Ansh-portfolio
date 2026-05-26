const preloaded = new Set()

function webpFromJpeg(src) {
  return src.replace(/\.jpe?g$/i, '.webp')
}

/**
 * Warm the browser cache before images enter the viewport (reduces scroll jank).
 * @param {string[]} urls
 * @param {{ priority?: 'high' | 'low', includeWebp?: boolean }} options
 */
export function preloadImages(urls, { priority = 'low', includeWebp = true } = {}) {
  if (typeof window === 'undefined') return

  const queue = []
  for (const src of urls) {
    if (!src || preloaded.has(src)) continue
    preloaded.add(src)
    queue.push(src)
    if (includeWebp && /\.jpe?g$/i.test(src)) {
      const webp = webpFromJpeg(src)
      if (!preloaded.has(webp)) {
        preloaded.add(webp)
        queue.push(webp)
      }
    }
  }

  queue.forEach((src, index) => {
    const isHigh = priority === 'high' && index < 4

    if (isHigh && !document.querySelector(`link[rel="preload"][href="${src}"]`)) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      if (src.endsWith('.webp')) link.type = 'image/webp'
      document.head.appendChild(link)
    }

    const img = new Image()
    img.decoding = 'async'
    if (isHigh && 'fetchPriority' in img) {
      img.fetchPriority = 'high'
    }
    img.src = src
  })
}

export { webpFromJpeg }
