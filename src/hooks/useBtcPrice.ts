import { useEffect, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import useSushi from './useSushi'
import { getBtcPrice } from '../sushi/utils'
import useIsMountedRef from './useIsMountedRef'

const useBtcPrice = () => {
  const [price, setPrice] = useState(new BigNumber(0))
  
    const sushi = useSushi()
    const isMountedRef = useIsMountedRef()

    const fetchBtcPrice = useCallback(async () => {
      const price = await getBtcPrice(sushi)
      if (isMountedRef.current) {
        setPrice(price)
      }
    }, [sushi, isMountedRef])

    useEffect(() => {
  
      if (sushi) {
        fetchBtcPrice()
      }
    }, [sushi, setPrice])
  
    return price
  }
  
  export default useBtcPrice