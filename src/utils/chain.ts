import { infuraId } from "../constants/infura"

export const getSupportedChainId = () => {
  return parseInt(process.env.REACT_APP_CHAIN_ID) || 1
}

export const getRpcUrl = (chainId: number) => {
  switch (chainId) {
    case 42:
      return `https://kovan.infura.io/v3/${infuraId}`
    case 1:
      return `https://mainnet.infura.io/v3/${infuraId}`
    case 56:
      return 'https://bsc-dataseed.binance.org/'
    default:
      return 'http://16.162.213.236:7545'
  }
}