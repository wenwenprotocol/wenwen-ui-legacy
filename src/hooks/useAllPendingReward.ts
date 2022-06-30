import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import {
  getRewardPools,
  getPendingReward,
} from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'
import useIsMountedRef from './useIsMountedRef'

const useAllPendingReward = () => {
  const [rewards, setRewards] = useState([] as Array<BigNumber>)
  const { account } = useWallet()
  const sushi = useSushi()
  const pools = getRewardPools(sushi)
  const block = useBlock()
  const isMountedRef = useIsMountedRef()

  const fetchAllPendingReward = useCallback(async () => {
    try {
      const rewards: Array<BigNumber> = await Promise.all(
        pools.map(
          ({
            pid,
            poolContract,
          }: {
            pid: number
            poolContract: Contract
          }) => 
          getPendingReward(poolContract, pid, account)
        ),
      )
      if (isMountedRef.current) {
        setRewards(rewards)
      }        
    }
    catch (e) {
      console.error('useAllPendingReward', e)
    }    
  }, [sushi, isMountedRef, account])

  useEffect(() => {
    if (account && sushi) {
      fetchAllPendingReward()
    }
  }, [account, block, fetchAllPendingReward, setRewards, sushi])

  return rewards
}

export default useAllPendingReward
