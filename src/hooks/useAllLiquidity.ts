import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Contract } from 'web3-eth-contract'

import {
  getFarms,
  getBalance,
  getCashPrice,
  getTokenDecimals
} from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'
import useIsMountedRef from './useIsMountedRef'
import { INTEGERS } from '../sushi/lib/constants'

const useAllLiquidity = () => {
  const [balances, setBalance] = useState([])
  const sushi = useSushi()
  const farms = getFarms(sushi)
  const block = useBlock(INTEGERS.ONE_HOUR_IN_SECONDS.times(1000).toNumber())
  const isMountedRef = useIsMountedRef()

  const fetchAllLiquidity = useCallback(async () => {
    try {
      const balances = await Promise.all(
        farms.map(async ({ lpContract, tokenContract }: {
            lpContract: Contract
            tokenContract: Contract
          }) => {
            let tokenAmount = await getBalance(tokenContract, lpContract.options.address)
            const tokenDecimals = await getTokenDecimals(tokenContract)
            tokenAmount = tokenAmount.div(new BigNumber(10).pow(tokenDecimals))
            const cashPrice = await getCashPrice(tokenContract)
            const tokenPrice = cashPrice.price.div(new BigNumber(10).pow(12))

            return tokenPrice.times(tokenAmount).times(2)
          }
        ),
      )
      if (isMountedRef.current) {
        setBalance(balances)
      }        
    }
    catch (e) {
      console.error('useAllLiquidity', e)
    }    
  }, [sushi, isMountedRef])

  useEffect(() => {
    if (sushi) {
      fetchAllLiquidity()
    }
  }, [block, fetchAllLiquidity, setBalance, sushi])

  return balances
}

export default useAllLiquidity
