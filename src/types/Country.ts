import type { Holiday } from './Holiday'

export interface Country {
  countryCode: string
  name: string
  holiday?: Holiday
}
