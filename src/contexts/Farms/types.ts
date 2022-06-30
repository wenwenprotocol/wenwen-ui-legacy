import { Contract } from 'web3-eth-contract'

export interface Farm {
  pid: number
  name: string
  lpToken: string
  lpTokenAddress: string
  lpContract: Contract
  inputTokenAddress: string
  cashTokenAddress: string
  earnToken: string
  earnTokenAddress: string
  icon: React.ReactNode
  id: string
  tokenSymbol: string,
  uniswap: string
}

export interface FarmsContext {
  farms: Farm[]
  unharvested: number
}
