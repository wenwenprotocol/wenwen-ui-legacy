import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Contract } from 'web3-eth-contract'

import {
  getMasterChefContract,
  getFarms,
  getPoolStakedValue,
} from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'
import useIsMountedRef from './useIsMountedRef'
import { INTEGERS } from '../sushi/lib/constants'

export interface StakedValue {
  tokenPrice: BigNumber
  tokenAmount: BigNumber
  poolValue: BigNumber
  poolWeight: BigNumber
}

const useAllStakedValue = () => {
  const [balances, setBalance] = useState([] as Array<StakedValue>)
  const sushi = useSushi()
  const farms = getFarms(sushi)
  const masterChefContract = getMasterChefContract(sushi)
  // const wbtcContract = getWbtcContract(sushi)
  const block = useBlock(INTEGERS.ONE_HOUR_IN_SECONDS.times(1000).toNumber())
  const isMountedRef = useIsMountedRef()

  const fetchAllStakedValue = useCallback(async () => {
    try {
      const balances: Array<StakedValue> = await Promise.all(
        farms.map(
          ({
            pid,
            lpContract,
            tokenContract,
          }: {
            pid: number
            lpContract: Contract
            tokenContract: Contract
          }) =>
            getPoolStakedValue(
              masterChefContract,
              lpContract,
              tokenContract,
              pid,
            ),
        ),
      )
      if (isMountedRef.current) {
        setBalance(balances)
      }        
    }
    catch (e) {
      console.error('useAllStakedValue', e)
    }    
  }, [sushi, masterChefContract, isMountedRef])

  useEffect(() => {
    if (masterChefContract && sushi) {
      fetchAllStakedValue()
    }
  }, [block, fetchAllStakedValue, masterChefContract, setBalance, sushi])

  return balances
}

export default useAllStakedValue
