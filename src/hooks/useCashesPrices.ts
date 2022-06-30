import { useCallback, useEffect, useState } from 'react'
import { Contract } from 'web3-eth-contract'

import useSushi from './useSushi'
import useIsMountedRef from './useIsMountedRef'

import { getCashes, getCashPrice } from '../sushi/utils'

const useCashesPrices = () => {
  const [prices, setPrices] = useState([])

  const sushi = useSushi()
  const isMountedRef = useIsMountedRef()
  const cashes = getCashes(sushi)

  const fetchCashesPrice = useCallback(async () => {
    const promises = cashes.map(({ tokenContract }: { tokenContract: Contract }) => getCashPrice(tokenContract))
    const prices = await Promise.all(promises)
    if (isMountedRef.current) {
      setPrices(prices.map((item: any, i) => ({
        ...cashes[i],
        price: item.price,
        targetPrice: item.targetPrice
      })))
    }
  }, [sushi, isMountedRef])

  useEffect(() => {
    if (sushi) {
      fetchCashesPrice()
    }
  }, [sushi])

  return prices
}

export default useCashesPrices