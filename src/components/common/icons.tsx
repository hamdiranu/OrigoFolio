import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function IconLayers(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}

export function IconCode(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

export function IconSparkle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2 14 10 22 12 14 14 12 22 10 14 2 12 10 10 Z" />
    </svg>
  )
}

export function IconGear(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="2.75" />
    </svg>
  )
}

export function IconArrowUpRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="8 7 17 7 17 16" />
    </svg>
  )
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <polyline points="5 12.5 10 17 19 7" />
    </svg>
  )
}
