import React, { createContext, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'

import { Sushi } from '../../sushi'
import { getRpcUrl, getSupportedChainId } from '../../utils/chain'
export interface SushiContext {
  sushi?: typeof Sushi
}

export const Context = createContext<SushiContext>({
  sushi: undefined,
})

declare global {
  interface Window {
    sushisauce: any,
    sushi: any,
    ethereum: any
  }
}

const SushiProvider: React.FC = ({ children }) => {
  const { chainId, ethereum } = useWallet()
  const [sushi, setSushi] = useState<any>()

  // @ts-ignore
  window.sushi = sushi
  // @ts-ignore
  const supportedChainId = getSupportedChainId()

  let rpc = getRpcUrl(supportedChainId)

  useEffect(() => {
      const provider = ethereum && chainId === supportedChainId ? ethereum : rpc
      const sushiLib = new Sushi(provider, supportedChainId, false, {
        defaultAccount: ethereum?.selectedAddress,
        defaultConfirmations: 1,
        autoGasMultiplier: 1.5,
        testing: false,
        defaultGas: '6000000',
        defaultGasPrice: '1000000000000',
        accounts: [],
        ethereumNodeTimeout: 10000,
      })

      setSushi(sushiLib)
      window.sushisauce = sushiLib
  }, [ethereum, rpc, supportedChainId, chainId])

  return <Context.Provider value={{ sushi }}>{children}</Context.Provider>
}

export default SushiProvider
