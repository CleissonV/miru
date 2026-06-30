import { Platform } from 'react-native'

export const API_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:3333/api'
    : 'http://localhost:3333/api'
  : 'https://api.miru.app/api'

export const COLORS = {
  bg: '#09090b',
  surface: '#18181b',
  surface2: '#27272a',
  border: '#27272a',
  text: '#e4e4e7',
  muted: '#71717a',
  subtle: '#52525b',
  accent: '#818cf8',
  pink: '#f472b6',
  blue: '#60a5fa',
  green: '#4ade80',
  yellow: '#facc15',
  red: '#f87171',
}
