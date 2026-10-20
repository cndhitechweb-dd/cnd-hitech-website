export interface LogoColor {
  label: string
  name: string
  primary: string
  secondary: string
  filter: string
}

export const LOGO_COLORS: LogoColor[] = [
  {
    label: '01',
    name: 'Classic Red & Gray',
    primary: '#B01116',
    secondary: '#6B7078',
    filter: 'brightness(0) invert(1) sepia(1) saturate(10) hue-rotate(320deg) brightness(0.78)',
  },
  {
    label: '02',
    name: 'Gold & Light Gray',
    primary: '#D4AF37',
    secondary: '#C4C9D4',
    filter: 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(14deg) brightness(0.92)',
  },
  {
    label: '03',
    name: 'White & Red Accent',
    primary: '#FFFFFF',
    secondary: '#E53935',
    filter: 'brightness(0) invert(1)',
  },
  {
    label: '04',
    name: 'Orange & Light Gray',
    primary: '#FF8A00',
    secondary: '#C4C9D4',
    filter: 'brightness(0) invert(1) sepia(1) saturate(10) hue-rotate(22deg)',
  },
  {
    label: '05',
    name: 'Teal & Light Gray',
    primary: '#00B3B8',
    secondary: '#C4C9D4',
    filter: 'brightness(0) invert(1) sepia(1) saturate(10) hue-rotate(152deg) brightness(0.88)',
  },
  {
    label: '06',
    name: 'Silver & Red Accent',
    primary: '#B0B6BE',
    secondary: '#E53935',
    filter: 'brightness(0) invert(1) brightness(0.7) saturate(0.12)',
  },
  {
    label: '07',
    name: 'Classic Red Icon + White Text',
    primary: '#B01116',
    secondary: '#FFFFFF',
    filter: 'classic-red-white',
  },
]

export const DEFAULT_LOGO_COLOR_INDEX = 2
