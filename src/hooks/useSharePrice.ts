import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'

import useSushi from './useSushi'
import { getSushiPrice } from '../sushi/utils'
import useIsMountedRef from './useIsMountedRef'

const useSharePrice = () => {
const [price, setPrice] = useState({ name: 'SHARE', price: new BigNumber(0)})

  const sushi = useSushi()
  const isMountedRef = useIsMountedRef()

  useEffect(() => {
    async function fetchSushiPrice() {
      const price = await getSushiPrice(sushi)
      if (isMountedRef.current) {
        setPrice({ name: 'SHARE', price })
      }
    }

    if (sushi) {
      fetchSushiPrice()
    }
  }, [sushi, setPrice, isMountedRef])

  return price
}

export default useSharePrice