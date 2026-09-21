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
  style,
  preferWebp = true,
}) {
  const webp = preferWebp && /\.jpe?g$/i.test(src) ? webpFromJpeg(src) : null

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
        style={style}
      />
    </picture>
  )
}

export default memo(ResponsivePicture)
