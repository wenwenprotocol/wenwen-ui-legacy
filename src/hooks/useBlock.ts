import { useCallback, useEffect, useState } from 'react'
import { useWallet  } from 'use-wallet'
import useIsMountedRef from './useIsMountedRef'
import useSushi from './useSushi'
import { getBlockNumber } from '../sushi/utils'
import { getSupportedChainId } from '../utils/chain'

const useBlock = (inverval = 5000) => {
  const [block, setBlock] = useState(0)
  const sushi = useSushi()
  const isMountedRef = useIsMountedRef()
  const { chainId } = useWallet()
  const supportedChainId = getSupportedChainId()

  const fetchBlock = useCallback(async () => {
    if (!sushi) return
    const latestBlockNumber = await getBlockNumber(sushi)
    if (block !== latestBlockNumber && isMountedRef.current) {
      setBlock(latestBlockNumber)
    }
  }, [isMountedRef, sushi])

  useEffect(() => {
    fetchBlock()
    if (chainId === supportedChainId) {
      const id = setInterval(async () => {
        fetchBlock()
      }, inverval)
  
      return () => clearInterval(id)
    }
  }, [fetchBlock, inverval, chainId, supportedChainId])

  return block
}

export default useBlock
