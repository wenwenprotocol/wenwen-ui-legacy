import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getMasterChefContract, getFarms } from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'
import useIsMountedRef from './useIsMountedRef'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([] as Array<BigNumber>)
  const { account } = useWallet()
  const sushi = useSushi()
  const farms = getFarms(sushi)
  const masterChefContract = getMasterChefContract(sushi)
  const block = useBlock()
  const isMountedRef = useIsMountedRef()

  const fetchAllBalances = useCallback(async () => {
    try {
      const balances: Array<BigNumber> = await Promise.all(
        farms.map(({ pid }: { pid: number }) =>
          getEarned(masterChefContract, pid, account)
        ),
      )
      if (isMountedRef.current) {
        setBalance(balances)
      }
    }
    catch (e) {
      console.error('useAllEarnings', e)
    }

  }, [account, masterChefContract, isMountedRef])

  useEffect(() => {
    if (account && masterChefContract && sushi) {
      fetchAllBalances()
    }
  }, [account, block, fetchAllBalances, masterChefContract, setBalance, sushi])

  return balances
}

export default useAllEarnings
