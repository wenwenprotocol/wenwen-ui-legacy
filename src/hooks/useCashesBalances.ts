import { useCallback, useEffect, useState } from 'react'
import { Contract } from 'web3-eth-contract'
import { useWallet } from 'use-wallet'

import useSushi from './useSushi'
import useIsMountedRef from './useIsMountedRef'

import { getCashes, getCashTotalSupply } from '../sushi/utils'

const useCashesBalances = () => {
  const [balances, setBalances] = useState([])

  const sushi = useSushi()

  const {account} = useWallet()
  const cashes = getCashes(sushi)
  const isMountedRef = useIsMountedRef()

  const fetchCashesPrices = useCallback(async () => {
    const promises = cashes.map(({tokenContract} : {tokenContract: Contract}) => getCashTotalSupply(tokenContract))
    const balances = await Promise.all(promises)
    if (isMountedRef.current) {
      setBalances(balances.map((item: any, i) => ({
        ...cashes[i],
        totalSupply: item.totalSupply
      })))
    }
  }, [account, sushi, isMountedRef])

  useEffect(() => {
    if (sushi) {
      fetchCashesPrices()
    }
  }, [sushi])

  return balances
}

export default useCashesBalances