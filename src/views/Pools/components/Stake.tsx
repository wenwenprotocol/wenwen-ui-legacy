import React, { useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'

import { Contract } from 'web3-eth-contract'
import Button from '../../../components/Button'
import IconButton from '../../../components/IconButton'
import Value from '../../../components/Value'
import WalletProviderModal from '../../../components/WalletProviderModal'
import Coins from '../../../components/Coins'

import useAllowance from '../../../hooks/useAllowance'
import useApprove from '../../../hooks/useApprove'
import useModal from '../../../hooks/useModal'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import { getBalanceNumber } from '../../../utils/formatBalance'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import Spacer from '../../../components/Spacer'
import { useTranslation } from 'react-i18next'
import { isBrowser } from 'react-device-detect'

interface StakeProps {
  poolContract: Contract
  tokenContract: Contract
  pid: number
  tokenName: string
  onStake: (amount: string) => Promise<void>
  onUnstake: (amount: string) => Promise<void>
  onClick?: () => void
  uniswap?: string
  stats?: Array<{ indicator: string | React.ReactNode, value: string | number }>
}

const Stake: React.FC<StakeProps> = ({ 
  poolContract, 
  tokenContract, 
  pid, 
  tokenName,
  onStake,
  onUnstake,
  onClick, 
  uniswap, 
  stats 
}) => {
  const { t } = useTranslation()

  const { account } = useWallet()
  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)

  const [requestedApproval, setRequestedApproval] = useState(false)

  const allowance = useAllowance(tokenContract, poolContract)

  const { onApprove } = useApprove(tokenContract, poolContract)

  const tokenBalance = useTokenBalance(tokenContract.options.address)
  const stakedBalance = useStakedBalance(pid, poolContract)

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={onStake}
      tokenName={tokenName}
      uniswap={uniswap}
    />,
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={onUnstake}
      tokenName={tokenName}
    />,
  )

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error('onApprove', e)
    }
  }, [onApprove, setRequestedApproval])

  return (
    <StyledMod>
      <StyledModBd onClick={onClick}>
        <StyledDesc>{`${t('farm.your_staked')} ${tokenName}`}</StyledDesc>
        <StyledValue>
          <Coins coins={[tokenName]} />
          <Spacer width="5px"/>
          <Value value={getBalanceNumber(stakedBalance)} />
        </StyledValue>
        <StyledStats>
          {stats && stats.map(({ indicator, value }, i) => (
            <StyledStatItem key={i}>
              <StyledDesc>{indicator}</StyledDesc>
              <StyledDesc>{value}</StyledDesc>
            </StyledStatItem>   
          ))}
        </StyledStats>          
      </StyledModBd>
      <StyledModFt>
        {!!account ? 
          <>
            {!allowance.toNumber() ? (
              <Button
                // disabled={requestedApproval}
                onClick={handleApprove}
                text={`${t('farm.approve')} ${isBrowser ? tokenName: ''}`}
              />
            ) : (
              <StyledBtns>
                <Button
                  disabled={stakedBalance.eq(new BigNumber(0))}
                  text={t('farm.unstake')}
                  onClick={onPresentWithdraw}
                />
                <Spacer width="10%"/>
                <IconButton onClick={onPresentDeposit}>
                  +
                </IconButton>
              </StyledBtns>
            )}
          </> : 
          <Button
            onClick={onPresentWalletProviderModal}
            text={t('wallet.unlock')}
          />}
      </StyledModFt>
    </StyledMod>
  )
}

const StyledMod = styled.div``

const StyledModBd = styled.div``

const StyledDesc = styled.div`
  font-size: 12px;
  line-height: 14px;
  color: #A8B0C1;
  margin-bottom: 10px;
`

const StyledValue = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
`

const StyledModFt = styled.div`
  margin-top: 20px;
`

const StyledBtns = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledStats = styled.div`
  margin-top: 20px;
`

const StyledStatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-flow: wrap;
`

export default Stake
