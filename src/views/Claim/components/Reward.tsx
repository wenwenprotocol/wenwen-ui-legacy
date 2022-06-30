import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { useTranslation } from 'react-i18next'

import Value from '../../../components/Value'
import Button from '../../../components/Button'
import WalletProviderModal from '../../../components/WalletProviderModal'
import Coins from '../../../components/Coins'
import Spacer from '../../../components/Spacer'

import useRewardPools from '../../../hooks/useRewardPools'
import useAllPendingReward from '../../../hooks/useAllPendingReward'
import useClaimRewards from '../../../hooks/useClaimRewards'
import useModal from '../../../hooks/useModal'

import { getBalanceNumber } from '../../../utils/formatBalance'
import { addTokenToWallet } from '../../../utils/provider'

const Reward: React.FC = () => {
  const { t } = useTranslation()

  const { account } = useWallet()
  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)

  const rewards = useAllPendingReward()
  const pools = useRewardPools()

  const tokens = pools.map((pool, i) => ({
    ...pool,
    pendingReward: rewards[i] ? rewards[i] : new BigNumber(0),
  }))

  const { onClaimReward } = useClaimRewards()
  const [pendingTx, setPendingTx] = useState(false)

  return (
    <StyledClaim>
      <StyledHd>{t('stake.rewards')}</StyledHd>
      <StyledBd>
        {tokens.length ?
          tokens.map(({ tokenSymbol, pendingReward, tokenAddress, tokenImage }) => (
            <StyledCash key={tokenSymbol}>
              <StyledLabel>
                <StyledItemText><span>{`${t('stake.earned')} ${tokenSymbol}`}</span></StyledItemText>
                <StyledLink 
                  onClick={() => addTokenToWallet({
                    address: tokenAddress,
                    symbol: tokenSymbol,
                    decimals: 18,
                    image: tokenImage,
                  })}
                >{t('wallet.add_to_wallet')}</StyledLink>
              </StyledLabel>             
              <StyledValue>
                <Coins coins={[tokenSymbol]} />
                <Spacer width="5px"/>
                <Value value={getBalanceNumber(pendingReward)} />
              </StyledValue>
            </StyledCash>
          )) : null
        }
      </StyledBd>
      <StyledFt>
        {!!account ? 
          <Button
            disabled={!rewards.reduce((prev, cur) => prev.plus(cur), new BigNumber(0)) || pendingTx}
            text={pendingTx ? t('farm.collecting') : t('stake.claim_all')}
            onClick={async () => {
              setPendingTx(true)
              try {
                await onClaimReward()
                setPendingTx(false)
              }
              catch {
                setPendingTx(false)
              }
            }}
          /> : 
          <Button
            onClick={onPresentWalletProviderModal}
            text={t('wallet.unlock')}
          />
        }
      </StyledFt>      
    </StyledClaim>
  )
}

const StyledClaim = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 30px;
`

const StyledHd = styled.div`
  font-size: 18px;
  color: #ffffff;
`

const StyledBd = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-flow: wrap;
`

const StyledValue = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
`

const StyledFt = styled.div`
  margin-top: 20px;
`

const StyledCash = styled.div`
  margin-bottom: 20px;
  flex-basis: 45%;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    flex-basis: 100%;
  }
`

const StyledLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`

const StyledItemText = styled.div`
  font-size: 12px;
  color: #A8B0C1;
`

const StyledLink = styled.a`
  color: ${props => props.theme.color.grey[500]};
  font-size: 12px;
  &:hover {
    color: ${props => props.theme.color.grey[400]};
    cursor: pointer;
  }
`

export default Reward
