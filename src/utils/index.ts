import BigNumber from 'bignumber.js'
import { i18n } from 'i18next'

export { default as formatAddress } from './formatAddress'

export const bnToDec = (bn: BigNumber, decimals = 18): number => {
  return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber()
}

export const decToBn = (dec: number, decimals = 18) => {
  return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals))
}

export const getDocUrl = (i18n: i18n, slug?: string) => {
  const lang = i18n.language || 'en'
  const url = 'https://docs.wenwen.money/'
  const baseUrl = lang === 'en' ? url : url + `v/${lang}/`

  return baseUrl + `${slug}`
}