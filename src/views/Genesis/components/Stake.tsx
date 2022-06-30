import React, { useCallback, useState } from 'react'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import BigNumber from 'bignumber.js'

import Button from '../../../components/Button'

import useAllowance from '../../../hooks/useAllowanceWbtc'
import useApprove from '../../../hooks/useApproveWbtc'
import useModal from '../../../hooks/useModal'
import useTokenBalance from '../../../hooks/useTokenBalance'

import DepositModal from './DepositModal'

import useSushi from '../../../hooks/useSushi'
import { getWbtcAddress, deposit } from "../../../sushi/utils";

interface StakeProps {
  vaultContract: Contract,
  vaultBalance: BigNumber,
}

const Stake: React.FC<StakeProps> = ({ vaultContract, vaultBalance }) => {
  const [requestedApproval, setRequestedApproval] = useState(false)

  const sushi = useSushi()
  const { account } = useWallet()

  const tokenBalance = useTokenBalance(getWbtcAddress(sushi))

  const allowance = useAllowance(vaultContract)

  const { onApprove } = useApprove(vaultContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)

      const txHash = await onApprove()
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error('onApprove', e)
    }
  }, [onApprove, setRequestedApproval])

  const handleDeposit = useCallback(
    async (amount: string) => {
      const txHash = await deposit(
        vaultContract,
        amount,
        account,
        'WBTC'
      )

    },
    [account, sushi],
  )

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={handleDeposit}
      tokenName={'WBTC'}
    />,
  )

  return (
    <>
      {!allowance.toNumber() ? (
        <Button
          disabled={requestedApproval}
          onClick={handleApprove}
          text={`Approve WBTC`}
        />
      ) : (
        <Button onClick={onPresentDeposit} text="Invest" />
      )}
    </>
  )
}

export default Stake
