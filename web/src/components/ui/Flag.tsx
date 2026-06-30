export function FlagBR({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 60 42" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="42" fill="#009739" />
      <polygon points="30,4 56,21 30,38 4,21" fill="#FEDD00" />
      <circle cx="30" cy="21" r="10" fill="#012169" />
      <path d="M20 21a14 14 0 0 1 20 -6" stroke="#fff" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

export function FlagUS({ size = 20 }: { size?: number }) {
  const stripeH = 42 / 13
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 60 42" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="42" fill="#fff" />
      {Array.from({ length: 13 }).map((_, i) =>
        i % 2 === 0 ? (
          <rect key={i} y={i * stripeH} width="60" height={stripeH} fill="#B22234" />
        ) : null,
      )}
      <rect width="24" height={stripeH * 7} fill="#3C3B6E" />
    </svg>
  )
}
