import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getBalance } from '../utils/erc20'
import useBlock from './useBlock'
import useIsMountedRef from './useIsMountedRef'

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, ethereum } = useWallet()
  const block = useBlock()
  const isMountedRef = useIsMountedRef()

  const fetchBalance = useCallback(async () => {
    const balance = await getBalance(ethereum, tokenAddress, account)
    if (isMountedRef.current) {
      setBalance(new BigNumber(balance))
    }
  }, [account, ethereum, tokenAddress, isMountedRef])

  useEffect(() => {
    if (account && ethereum) {
      fetchBalance()
    }
  }, [account, ethereum, setBalance, block, tokenAddress, fetchBalance])

  return balance
}

export default useTokenBalance
