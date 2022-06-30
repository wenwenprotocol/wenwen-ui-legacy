import { useContext } from 'react'
import { Context as RewardContext } from '../contexts/RewardPools'

const useRewardPools = () => {
  const { pools } = useContext(RewardContext)
  return pools
}

export default useRewardPools