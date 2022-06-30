export interface Cash {
  pid: number
  name: string
  vaultAddress: string
  vaultContract: any
  tokenAddress: string
  tokenContract: any,
  icon: string
  id: string
  tokenSymbol: string,
  amountToClaim?: number
}

export interface CashesContext {
  cashes: Cash[]
}
