import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import { getStaked } from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'
import useIsMountedRef from './useIsMountedRef'

const useStakedBalance = (pid: number, poolContract: Contract) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const sushi = useSushi()
  const block = useBlock()
  const isMountedRef = useIsMountedRef()

  const fetchBalance = useCallback(async () => {
    const balance = await getStaked(poolContract, pid, account)
    if (isMountedRef.current) {
      setBalance(new BigNumber(balance))
    }
  }, [account, pid, sushi, isMountedRef])

  useEffect(() => {
    if (account && sushi) {
      fetchBalance()
    }
  }, [account, pid, setBalance, block, sushi, fetchBalance])

  return balance
}

export default useStakedBalance
