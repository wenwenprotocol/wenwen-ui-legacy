import { useCallback } from 'react'
import { Contract } from 'web3-eth-contract'

import useSushi from './useSushi'
import { useWallet } from 'use-wallet'

import { stakeToken } from '../sushi/utils'

const useStakeToken = (pid: number, poolContract: Contract) => {
  const { account } = useWallet()
  const sushi = useSushi()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stakeToken(
        poolContract,
        pid,
        amount,
        account,
        account,
      )
    },
    [account, pid, sushi],
  )

  return { onStake: handleStake }
}

export default useStakeToken
