import { useCallback, useEffect, useState } from 'react'
import { Contract } from 'web3-eth-contract'
import { useWallet } from 'use-wallet'
import BigNumber from 'bignumber.js'

import useSushi from './useSushi'
import useBlock from './useBlock'
import useIsMountedRef from './useIsMountedRef'

import { getCashes, getCashToClaim } from '../sushi/utils'
import {bnToDec} from '../utils'

const useCashToClaim = () => {
  const [amounts, setAmounts] = useState([])

  const sushi = useSushi()
  const block = useBlock()
  const isMountedRef = useIsMountedRef()

  const {account} = useWallet()
  const cashes = getCashes(sushi)

  const fetchCashToClaim = useCallback(async () => {
    const promises = cashes.map(({ tokenContract } : {tokenContract: Contract, name: string}) => getCashToClaim(tokenContract))
    const amounts: {isCash: boolean, amount: BigNumber}[] = await Promise.all(promises)

    let shareAmount = 0

    const cashWithClaim = cashes.map((cash: any, i: number) => {
      const { isCash, amount } = amounts[i] 

      let amountToClaim = bnToDec(amount)

      if (!isCash) {
        amountToClaim = bnToDec(new BigNumber(0))
        shareAmount += bnToDec(amount)
      }

      return {
      ...cash,
      amountToClaim,
      }
    })
    if (isMountedRef.current) {
      setAmounts([{name: 'SHARE', amountToClaim: shareAmount}, ...cashWithClaim])
    }
  }, [block, account, sushi, isMountedRef])

  useEffect(() => {
    if (sushi) {
      fetchCashToClaim()
    }
  }, [block, sushi])

  return amounts
}

export default useCashToClaim