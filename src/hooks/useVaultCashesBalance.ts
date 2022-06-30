import { useEffect, useState, useCallback } from 'react'

import useSushi from './useSushi'
import useBlock from './useBlock'
import useCashes from './useCashes'
import useIsMountedRef from './useIsMountedRef'

import { getVaultCashBalance } from "../sushi/utils";

const useVaultCashesBalance = () => {
  const [balances, setBalances] = useState([])

  const sushi = useSushi()
  const block = useBlock(60000)
  const cashes = useCashes()
  const isMountedRef = useIsMountedRef()

  const fetchVaultCashesBalance = useCallback(async () => {
    const promises = cashes.map(({ tokenContract, vaultAddress, name }) => getVaultCashBalance(tokenContract, vaultAddress, name))
    try {
      const balances = await Promise.all(promises)
      if (isMountedRef.current) {
        setBalances(balances)
      }
    } 
    catch (e) {
      console.error('useVaultCashesBalance', e)
    }
  }, [sushi, block, cashes, isMountedRef])

  useEffect(() => {
    if (sushi) {
      fetchVaultCashesBalance()
    }
  }, [sushi, block, cashes])

  return balances
}

export default useVaultCashesBalance
