import { useCallback, useEffect, useState } from 'react'
import useIsMountedRef from './useIsMountedRef'
import Web3 from 'web3'
import { useWallet } from 'use-wallet'
import { Hex } from 'web3-utils'

const useChainId = () => {
  const [chainId, setChainId] = useState(-1)
  const isMountedRef = useIsMountedRef()

  const { ethereum } = useWallet()

  const provider = window.ethereum

  const fetchChainId = useCallback(async () => {
    if (!provider) return
    const web3 = new Web3(provider)
    const id = await web3.eth.getChainId()
    if (isMountedRef.current) {
      setChainId(id)
    }
  }, [isMountedRef, provider])

  useEffect(() => {
    const realProvider = ethereum || provider
    if (realProvider && realProvider.on) {
      realProvider.on('chainChanged', (chainId: Hex) => {
        const id = Web3.utils.hexToNumber(chainId)
        console.warn('chainChanged', id)
        setChainId(id)
      })
    }
    return () => realProvider.removeListener('chainChanged', () => {})
  }, [])

  useEffect(() => {
    fetchChainId()
  }, [ethereum, provider, fetchChainId])

  return chainId
}

export default useChainId
