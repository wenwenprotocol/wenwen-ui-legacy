import { useCallback } from 'react'
import useSushi from './useSushi'
import useRewardPools from './useRewardPools'
import { useWallet } from 'use-wallet'
import { getWenBankerV2Contract, claimRewardWithPids } from '../sushi/utils'

const useClaimRewards = () => {
  const { account } = useWallet()
  const sushi = useSushi()
  const wenBankerV2Contract = getWenBankerV2Contract(sushi)
  
  const pools = useRewardPools()
  const pids = pools.map(pool => pool.pid)

  const handleReward = useCallback(async () => {
    const txHash = await claimRewardWithPids(
      wenBankerV2Contract, 
      pids, 
      [account, account, account, account], 
      account
    )

    return txHash
  }, [account, sushi])

  return { onClaimReward: handleReward }
}

export default useClaimRewards
