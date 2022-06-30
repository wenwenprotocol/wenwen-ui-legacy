import { useCallback } from 'react'

import useSushi from './useSushi'
import { useWallet } from 'use-wallet'

import { harvest, getMasterChefContract } from '../sushi/utils'

const useReward = (pid: number) => {
  const { account } = useWallet()
  const sushi = useSushi()
  const masterChefContract = getMasterChefContract(sushi)

  const handleReward = useCallback(async () => {
    const txHash = await harvest(masterChefContract, pid, account)

    return txHash
  }, [account, pid, sushi])

  return { onReward: handleReward }
}

export default useReward
