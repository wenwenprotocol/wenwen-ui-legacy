import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import {
  getPastEvents,
} from '../sushi/utils'
import useSushi from './useSushi'
import useIsMountedRef from './useIsMountedRef'
import useBlock from './useBlock'
import { INTEGERS } from './../sushi/lib/constants'
export interface ContractEvent<T> {
  returnValues: T
  raw: any
  event: string
  signature: string
  logIndex: number
  transactionIndex: number
  transactionHash: string
  blockHash: string
  blockNumber: number
  address: string
}

export interface EventOptions {
  filter?: any
  fromBlock?: number | string | BigNumber
  toBlock?: number | string | BigNumber
  topics?: Array<any>
  days?: number
}

const usePastEvents = <T = any>(contract: Contract, eventName: string, opts: EventOptions = { days: 1 }) => {
  const [events, setEvents] = useState([] as Array<ContractEvent<T>>)
  const { account } = useWallet()
  
  const sushi = useSushi()
  const block = useBlock(INTEGERS.ONE_HOUR_IN_SECONDS.times(1000).toNumber())

  const isMountedRef = useIsMountedRef()

  const period = INTEGERS.ONE_DAY_IN_SECONDS.times(opts.days).dividedBy(INTEGERS.AVERAGE_BLOCK_TIME).integerValue()

  const fromBlock = block - period.toNumber()

  const options = {
    fromBlock: fromBlock > 0 ? fromBlock : 0,
    toBlock: block,
    ...opts,
  }

  const fetchPastEvents = useCallback(async () => {
    try {
      const events: Array<ContractEvent<T>> = await getPastEvents(contract, eventName, options)

      if (isMountedRef.current) {
        setEvents(events)
      }        
    }
    catch (e) {
      console.error('usePastEvents', e)
    }    
  }, [sushi, block, isMountedRef])

  useEffect(() => {
    if (sushi) {
      fetchPastEvents()
    }
  }, [fetchPastEvents, setEvents, sushi])

  return events
}

export default usePastEvents
