import { Contract } from 'web3-eth-contract'

export interface RewardPool {
  pid: number
  poolAddress: string
  poolContract: Contract
  tokenAddress: string
  tokenContract: Contract
  tokenSymbol: string,
  tokenImage: string,
}

export interface RewardContext {
  pools: RewardPool[]
}
