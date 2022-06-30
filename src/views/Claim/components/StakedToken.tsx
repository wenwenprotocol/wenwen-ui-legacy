import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { Contract } from 'web3-eth-contract'

import Stake from '../../Pools/components/Stake'

import { useTranslation } from 'react-i18next'
import useRewardPools from '../../../hooks/useRewardPools'
import useTotalStakedBalance from '../../../hooks/useTotalStakedBalance'
import useStakedBalance from '../../../hooks/useStakedBalance'
import { getDisplayBalance } from '../../../utils/formatBalance'
import useSharePrice from '../../../hooks/useSharePrice'
import useCashesPrices from '../../../hooks/useCashesPrices'
import useStakeToken from '../../../hooks/useStakeToken'
import useUnstakeToken from '../../../hooks/useUnstakeToken'
import usePastEvents from '../../../hooks/usePastEvents'
import { bnToDec } from '../../../utils'
import Tooltip from '../../../components/Tooltip'

interface RestableEvent {
  pids: string[]
  supplys: string[]
  directs: Boolean[]
}

interface tokenProps {
  pid: number
  tokenSymbol: string
  poolContract: Contract
  tokenContract: Contract
}

const StakedToken: React.FC<tokenProps> = ({ 
  pid, 
  tokenSymbol, 
  poolContract,
  tokenContract,
}) => {
  const { t } = useTranslation()

  const pools = useRewardPools()

  const { onStake } = useStakeToken(pid, poolContract)
  const { onUnstake } = useUnstakeToken(pid, poolContract)

  const totalStakedBalance = useTotalStakedBalance(poolContract, tokenContract)
  const stakedBalance = useStakedBalance(pid, poolContract)

  const days = 7
  const restableEvents = usePastEvents<RestableEvent>(poolContract, 'Restable', { days })

  // console.log('restableEvents', restableEvents)

  const sharePrice = useSharePrice()
  const cashPrices = useCashesPrices()

  // calculate total addtional issuance rewards for APR
  let totalSupplyValue = 0

  restableEvents.forEach(({ returnValues }) => {
    const { pids, supplys, directs } = returnValues

    // SHAREN
    if (pid === 0) {
      directs.forEach((direct, i) => {
        if (direct) {
          const pool = pools.find(pool => pool.pid === Number(pids[i]))
          const cash = cashPrices.find(({ name }) => name === pool.tokenSymbol)
          const price = cash ? cash.price : new BigNumber(0)
          totalSupplyValue = totalSupplyValue + bnToDec(price, 12) * bnToDec(new BigNumber(supplys[i]))
        }
      })
    } 
    // Stable coins
    else {
      directs.forEach((direct, i) => {
        if (!direct && Number(pids[i]) === pid) {
          const price = sharePrice ? sharePrice.price : new BigNumber(0)
          totalSupplyValue = totalSupplyValue + bnToDec(price, 12) * bnToDec(new BigNumber(supplys[i]))
        }
      })
    }
    
  })

  let stakedTokenPrice
  if (pid === 0) {
    stakedTokenPrice = sharePrice ? sharePrice.price : new BigNumber(0)
  } else {
    const cash = cashPrices.find(({ name }) => name === tokenSymbol)
    stakedTokenPrice = cash ? cash.price : new BigNumber(0)
  }

  const stakedValue = bnToDec(totalStakedBalance) * bnToDec(stakedTokenPrice, 12)

  const stats = [
    {
      indicator: t('farm.total_staked'),
      value: totalStakedBalance ? getDisplayBalance(totalStakedBalance) : '0'
    },
    {
      indicator: <StyledBd>
        <span>{t('stake.seven_day_apr')}</span>
        <Tooltip tip={t('stake.seven_day_apr_tip')} markSize="14px">?</Tooltip>
      </StyledBd>,
      value: stakedValue ? `${new BigNumber(totalSupplyValue / stakedValue / days * 365 * 100).toFormat(2)}%` : '0.00%'
    },
    {
      indicator: t('farm.your_share'),
      value: stakedBalance && totalStakedBalance && totalStakedBalance.gt(0) ? `${stakedBalance.dividedBy(totalStakedBalance).times(new BigNumber(100)).toFixed(2)}%` : '0.00%',
    },
  ]

  return (
    <StyledToken key={tokenSymbol}>
      <Stake
        onStake={onStake}
        onUnstake={onUnstake}
        poolContract={poolContract}
        tokenContract={tokenContract}
        pid={pid}
        tokenName={tokenSymbol}
        stats={stats}
      />                          
    </StyledToken>
  )
}

const StyledToken = styled.div`
  margin-bottom: 40px;
  flex-basis: 45%;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    flex-basis: 100%;
  }
`
const StyledBd = styled.div`
  display: flex;
  justify-content: space-around;

  & span {
    margin-right: 5px;
  }
`

export default StakedToken
