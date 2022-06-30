import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'

import useSushi from './useSushi'
import useBlock from './useBlock'
import useIsMountedRef from './useIsMountedRef'

import { getSushiSupply } from '../sushi/utils'
import { INTEGERS } from '../sushi/lib/constants'

const useShareTotalSupply = () => {
  const [totalSupply, setTotalSupply] = useState<BigNumber>(new BigNumber(0))
  const sushi = useSushi()
  const block = useBlock(INTEGERS.ONE_HOUR_IN_SECONDS.times(1000).toNumber())
  const isMountedRef = useIsMountedRef()

  useEffect(() => {
    async function fetchTotalSupply() {
      const supply = await getSushiSupply(sushi)
      if (isMountedRef.current) {
        setTotalSupply(supply)
      }
    }

    if (sushi) {
      fetchTotalSupply()
    }
  }, [block, sushi, setTotalSupply, isMountedRef])

  return totalSupply
}

export default useShareTotalSupply