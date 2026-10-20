import cndLogoImg from '../imports/CND_LOGO_2026-5.png'

const RED_ICON_FILTER = 'brightness(0) invert(1) sepia(1) saturate(10) hue-rotate(320deg) brightness(0.78)'

export function LogoImage({ height = 44, colorFilter }: { height?: number; colorFilter?: string }) {
  const aspectRatio = 1570 / 305
  const w = Math.round(height * aspectRatio)

  if (colorFilter === 'classic-red-white') {
    return (
      <div style={{ position: 'relative', display: 'inline-block', height, width: w, flexShrink: 0 }}>
        {/* White base: company name + subtitle rendered white */}
        <img
          src={cndLogoImg}
          alt="CND HI-TECH CO.,"
          style={{ display: 'block', height, width: w, objectFit: 'contain', objectPosition: 'left center', filter: 'brightness(0) invert(1)' }}
        />
        {/* Original-color icon overlay clipped to the badge area (~left 20%) */}
        <img
          src={cndLogoImg}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute', top: 0, left: 0,
            height, width: w, objectFit: 'contain', objectPosition: 'left center',
            filter: 'none',
            clipPath: 'inset(0 80% 0 0)',
          }}
        />
      </div>
    )
  }

  return (
    <img
      src={cndLogoImg}
      alt="CND HI-TECH CO.,"
      style={{
        height,
        width: w,
        objectFit: 'contain',
        filter: colorFilter ?? 'brightness(0) invert(1)',
        transition: 'filter 0.4s ease',
      }}
    />
  )
}

export function LogoIcon({ size = 38, colorFilter }: { size?: number; colorFilter?: string }) {
  return <LogoImage height={size} colorFilter={colorFilter} />
}
