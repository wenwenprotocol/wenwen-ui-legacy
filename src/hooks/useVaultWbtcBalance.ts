import {useEffect, useState, useCallback} from 'react'
import BigNumber from 'bignumber.js';

import useSushi from './useSushi'
import useBlock from './useBlock'
import useIsMountedRef from './useIsMountedRef'
import { getBalance, getWbtcContract, getVaultAddress } from "../sushi/utils"
import { INTEGERS } from '../sushi/lib/constants'

const useVaultWbtcBalance = () => {
  const [balance, setBalance] = useState(new BigNumber(0))

  const sushi = useSushi()
  const block = useBlock(INTEGERS.ONE_HOUR_IN_SECONDS.times(1000).toNumber())
  const isMountedRef = useIsMountedRef()

  const vaultAddress = getVaultAddress(sushi)
  const wbtcContract = getWbtcContract(sushi)

  const fetchVaultWbtcBalance = useCallback(async () => {
    const balance = await getBalance(wbtcContract, vaultAddress)
    if (isMountedRef.current) {
      setBalance(balance)
    }
  }, [wbtcContract, vaultAddress, isMountedRef])

  useEffect(() => {
    if (sushi) {
      fetchVaultWbtcBalance()
    }
  }, [sushi, block, fetchVaultWbtcBalance])

  return balance
}

export default useVaultWbtcBalance
