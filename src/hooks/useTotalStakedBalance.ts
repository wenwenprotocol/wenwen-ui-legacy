import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { Contract } from 'web3-eth-contract'

import { getBalance } from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'
import useIsMountedRef from './useIsMountedRef'

const useTotalStakedBalance = (poolContract: Contract, tokenContract: Contract) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const sushi = useSushi()

  const block = useBlock(6000)
  const isMountedRef = useIsMountedRef()

  const fetchTotalStakedBalance = useCallback(async () => {
    try {
      const balance: BigNumber = await getBalance(tokenContract, poolContract.options.address)

      if (isMountedRef.current) {
        setBalance(balance)
      }        
    }
    catch (e) {
      console.error('useTotalStakedBalance', e)
    }    
  }, [sushi, isMountedRef])

  useEffect(() => {
    if (sushi) {
      fetchTotalStakedBalance()
    }
  }, [block, fetchTotalStakedBalance, setBalance, sushi])

  return balance
}

export default useTotalStakedBalance
