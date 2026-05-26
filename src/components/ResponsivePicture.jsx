import { memo } from 'react'
import { webpFromJpeg } from '../utils/preloadImages'

function ResponsivePicture({
  src,
  alt = '',
  className = '',
  width,
  height,
  loading = 'lazy',
  fetchPriority,
  sizes,
}) {
  const webp = /\.jpe?g$/i.test(src) ? webpFromJpeg(src) : null

  return (
    <picture>
      {webp ? <source srcSet={webp} type="image/webp" /> : null}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        sizes={sizes}
        className={className}
      />
    </picture>
  )
}

export default memo(ResponsivePicture)
