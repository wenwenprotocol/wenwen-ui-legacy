import { useCallback } from 'react'
import useSushi from './useSushi'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import { approveWbtc, getWbtcContract } from '../sushi/utils'

const useApproveWbtc = (vaultContract: Contract) => {
  const { account } = useWallet()
  const sushi = useSushi()
  const wbtcContract = getWbtcContract(sushi)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approveWbtc(wbtcContract, vaultContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, wbtcContract, vaultContract])

  return { onApprove: handleApprove }
}

export default useApproveWbtc
