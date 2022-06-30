import { useCallback, useEffect, useState } from 'react'
import { Contract } from 'web3-eth-contract'

import useSushi from './useSushi'
import useBlock from './useBlock'
import useIsMountedRef from './useIsMountedRef'

import {
  getFarms,
  getTokenTotalSupply,
} from '../sushi/utils'
import { INTEGERS } from '../sushi/lib/constants'

const useTotalSupply = () => {
  const [totalSupplies, setTotalSupplies] = useState([])

  const sushi = useSushi()
	const farms = getFarms(sushi)
  const block = useBlock(INTEGERS.ONE_HOUR_IN_SECONDS.times(1000).toNumber())
  const isMountedRef = useIsMountedRef()

  const fetchAllTotalSupply = useCallback(async () => {
    const totalSupplies = await Promise.all(
      farms.map(({lpContract}: {lpContract: Contract}) => getTokenTotalSupply(lpContract))
    )
    if (isMountedRef.current) {
      setTotalSupplies(totalSupplies)
    }
  }, [isMountedRef])

  useEffect(() => {
    if (sushi && farms && farms.length) {
      fetchAllTotalSupply()
    }
  }, [sushi, fetchAllTotalSupply, block])

  return totalSupplies
}

export default useTotalSupply