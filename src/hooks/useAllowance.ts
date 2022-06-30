import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import { getAllowance } from '../utils/erc20'
import useIsMountedRef from './useIsMountedRef'

const useAllowance = (tokenContract: Contract, poolContract: Contract) => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account } = useWallet()
  const isMountedRef = useIsMountedRef()

  const fetchAllowance = useCallback(async () => {
    const allowance = await getAllowance(
      tokenContract,
      account,
      poolContract.options.address,
    )
    if (isMountedRef.current) {
      setAllowance(new BigNumber(allowance))
    }
  }, [account, poolContract, tokenContract, isMountedRef])

  useEffect(() => {
    if (account && poolContract && tokenContract) {
      fetchAllowance()
    }
    let refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, poolContract, tokenContract, fetchAllowance])

  return allowance
}

export default useAllowance
