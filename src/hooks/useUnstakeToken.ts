import { useCallback } from 'react'
import { Contract } from 'web3-eth-contract'
import { useWallet } from 'use-wallet'
import { unstakeToken } from '../sushi/utils'
import useSushi from './useSushi'

const useUnstakeToken = (pid: number, poolContract: Contract) => {
  const { account } = useWallet()
  const sushi = useSushi()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstakeToken(
        poolContract, 
        pid, 
        amount, 
        account,
        account,
      )
      console.log(txHash)
    },
    [account, pid, sushi],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakeToken
