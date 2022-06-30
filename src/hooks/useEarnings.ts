import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getMasterChefContract } from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'
import useIsMountedRef from './useIsMountedRef'

const useEarnings = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const {
    account,
  }: { account: string } = useWallet()

  const sushi = useSushi()
  const masterChefContract = getMasterChefContract(sushi)
  const block = useBlock()
  const isMountedRef = useIsMountedRef()
  
  const fetchBalance = useCallback(async () => {
    try {
      const balance = await getEarned(masterChefContract, pid, account)
      if (isMountedRef.current) {
        setBalance(new BigNumber(balance))
      }
    }
    catch (e) {
      console.error('useEarnings', e)
    }

  }, [account, masterChefContract, pid, isMountedRef])

  useEffect(() => {
    if (account && masterChefContract && sushi) {
      fetchBalance()
    }
  }, [account, block, masterChefContract, setBalance, sushi, pid, fetchBalance])

  return balance
}

export default useEarnings
