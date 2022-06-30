import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import useSushi from './useSushi'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import useIsMountedRef from './useIsMountedRef'

import { getAllowance } from '../utils/erc20'
import { getWbtcContract } from '../sushi/utils'

const useAllowance = (vaultContract: Contract) => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account } = useWallet()
  const sushi = useSushi()
  const wbtcContract = getWbtcContract(sushi)
  const isMountedRef = useIsMountedRef()

  const fetchAllowance = useCallback(async () => {
    const allowance = await getAllowance(
      wbtcContract,
      account,
      vaultContract.options.address,
    )
    if (isMountedRef.current) {
      setAllowance(new BigNumber(allowance))
    }
  }, [account, vaultContract, wbtcContract, isMountedRef])

  useEffect(() => {
    if (account && wbtcContract && vaultContract) {
      fetchAllowance()
    }
    let refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, wbtcContract, vaultContract])

  return allowance
}

export default useAllowance
