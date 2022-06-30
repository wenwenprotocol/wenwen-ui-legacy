import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import useIsMountedRef from './useIsMountedRef'
import useBlock from './useBlock'
import useSushi from './useSushi'
import {
  getMasterChefContract,
  getFarms,
  getShareRewardByBlock,
} from '../sushi/utils'
import { INTEGERS } from './../sushi/lib/constants'


const useShareRewardPerDay = () => {
  const [rewards, setRewards] = useState([] as Array<BigNumber>)
  const sushi = useSushi()
  const farms = getFarms(sushi)
  const block = useBlock(INTEGERS.ONE_HOUR_IN_SECONDS.times(1000).toNumber())
  const masterChefContract = getMasterChefContract(sushi)
  const isMountedRef = useIsMountedRef()
  const blockPerDay = INTEGERS.ONE_DAY_IN_SECONDS.times(1).dividedBy(INTEGERS.AVERAGE_BLOCK_TIME).integerValue()

  const fetchRewardPerDay = useCallback(async () => {
    try {
      const fromBlock = block - blockPerDay.toNumber()
      const rewards: Array<BigNumber> = await Promise.all(
        farms.map(() => fromBlock > 0 ? getShareRewardByBlock(masterChefContract, fromBlock, block) : new BigNumber(0)),
      )
      if (isMountedRef.current) {
        setRewards(rewards)
      }        
    }
    catch (e) {
      console.error('useShareRewardPerDay', e)
    }
  }, [sushi, masterChefContract, isMountedRef, block])

  useEffect(() => {
    if (masterChefContract && sushi) {
      fetchRewardPerDay()
    }
  }, [block, masterChefContract, fetchRewardPerDay, sushi])

  return rewards
}

export default useShareRewardPerDay
