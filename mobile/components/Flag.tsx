import Svg, { Rect, Polygon, Circle, Path } from 'react-native-svg'

export function FlagBR({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 0.7} viewBox="0 0 60 42">
      <Rect width="60" height="42" fill="#009739" />
      <Polygon points="30,4 56,21 30,38 4,21" fill="#FEDD00" />
      <Circle cx="30" cy="21" r="10" fill="#012169" />
      <Path d="M20 21a14 14 0 0 1 20 -6" stroke="#fff" strokeWidth="1.5" fill="none" />
    </Svg>
  )
}

export function FlagUS({ size = 20 }: { size?: number }) {
  const stripeH = 42 / 13
  return (
    <Svg width={size} height={size * 0.7} viewBox="0 0 60 42">
      <Rect width="60" height="42" fill="#fff" />
      {Array.from({ length: 13 }).map((_, i) =>
        i % 2 === 0 ? (
          <Rect key={i} y={i * stripeH} width="60" height={stripeH} fill="#B22234" />
        ) : null,
      )}
      <Rect width="24" height={stripeH * 7} fill="#3C3B6E" />
    </Svg>
  )
}
