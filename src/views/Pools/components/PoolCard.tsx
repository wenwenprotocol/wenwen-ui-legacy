import React, { Fragment, useState, useMemo } from 'react'
import { provider } from 'web3-core'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { isBrowser } from 'react-device-detect'
import { Farm } from '../../../contexts/Farms'

import useAllStakedValue, { StakedValue } from '../../../hooks/useAllStakedValue'
import useFarms from '../../../hooks/useFarms'
import useAllEarnings from '../../../hooks/useAllEarnings'
import useSharePrice from '../../../hooks/useSharePrice'
import useSushi from '../../../hooks/useSushi'
import useStake from '../../../hooks/useStake'
import useUnstake from '../../../hooks/useUnstake'
import useShareRewardPerDay from '../../../hooks/useShareRewardPerDay'
import useModal from '../../../hooks/useModal'

import Harvest from './Harvest'
import Stake from './Stake'

import { getContract } from '../../../utils/erc20'

import { getBalanceNumber } from '../../../utils/formatBalance'

import './poolcards.css'

import Icon from '../../../components/Icon'
import { ChevronUp, ChevronDown } from '../../../components/icons'
import Coins from '../../../components/Coins'

import Button from '../../../components/Button'
import WalletProviderModal from '../../../components/WalletProviderModal'
import { useTranslation } from 'react-i18next'
import { getMasterChefContract } from '../../../sushi/utils'

interface FarmWithStakedValue extends Farm, StakedValue {
  apy: BigNumber
  uniswap: string
}

const PoolCards: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWallet()

  const [active, setActive] = useState(-1)

  const allEarnings = useAllEarnings()

  const farms = useFarms()
  const stakedValue = useAllStakedValue()

  const sharePrice = useSharePrice()

  // const TOTAL_SHAREN_REWARD = new BigNumber(7150990)
  const sharenRewards = useShareRewardPerDay()

  const rows = farms.map((farm, i) => {
    const farmWithStakedValue = {
      ...farm,
      ...stakedValue[i],
      apy: stakedValue[i] && sharenRewards[i]
        ? sharePrice.price.div(new BigNumber(10).pow(12))
            .times(sharenRewards[i])
            .times(stakedValue[i].poolWeight)
            .div(stakedValue[i].poolValue)
            .times(365)
        : null,
    }

    return farmWithStakedValue
  })

  const handleToggle = (id: number) => {
    const klas = document.querySelector(`#detail-${id}`).classList
    const flag = klas.contains('active')

    document.querySelectorAll('.pool-card').forEach((d: Element) => d.classList.remove('active'))

    if (flag) {
      setActive(-1)
      klas.remove('active')
    } else {
      setActive(id)
      klas.add('active')
    }
  }

  return (
    <table className="pool-cards">
      <tbody>
        {rows.map((row, i) => (
          <Fragment key={i}>
            <tr className="pool-column" onClick={() => handleToggle(row.pid)}>
              <td>
                <div className="name">
                  <Coins coins={row.lpToken.slice(0, -3).split('-')} />
                  <span>{row.lpToken}</span>
                </div>
              </td>
              {isBrowser ? 
                <>
                  <td className="tvl">
                    <div className="label">{t('farm.tvl')}</div>
                    <div className="value">
                      {stakedValue && stakedValue[i] ? `$${stakedValue[i].poolValue.toFormat(0)}` : '$0'}
                    </div>
                  </td>
                  <td className="rewards">
                    <div className="label">SHAREN {t('farm.rewards')}</div>
                    <div className="value">
                      {sharenRewards && sharenRewards[i] ? `${sharenRewards[i].times(row.poolWeight || 0).toFormat(1)} / Day` : '0'}
                    </div>
                  </td>
                </> : null}
              <td className="apy">
                <div className="label">{t('farm.apr')}</div>
                <div className="value">
                  {row.apy && row.apy.toNumber() ? (
                    `${row.apy.times(new BigNumber(100)).toNumber().toLocaleString('en-US').slice(0, -1)}%`
                  ) : (
                    '-%'
                  )}
                </div>
              </td>                            
              {!!account && isBrowser ? 
                <td>
                  <div className="label">{t('farm.earned')}</div>
                  <div className="value">
                    {allEarnings && allEarnings[i] ? getBalanceNumber(new BigNumber(allEarnings[i])).toFixed(2) : '0'}
                  </div>
                </td> : null}
              {isBrowser ? <td>
                <div className="op">
                  {active === row.pid ? 
                    <Icon><ChevronUp /></Icon> : <Icon><ChevronDown /></Icon>}
                </div>
              </td> : null}
            </tr>
            <tr id={'detail-' + row.pid} className="pool-card">
              {isBrowser ? <td /> : null}
              {!!account && isBrowser ? <td /> : null}
              <PoolCard farm={row} />
              {isBrowser ? <td>
                <a href={row.uniswap} target="_blank" rel="noopener noreferrer" className="pool-card__action">
                  {t('farm.add_liquidity')}
                </a>
              </td> : null}
              {isBrowser ? <><td /></> : null}
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
  )
}

interface PoolCardProps {
  farm: FarmWithStakedValue
  onClick?: () => void
}

const PoolCard: React.FC<PoolCardProps> = ({ farm, onClick }) => {
  const { account, ethereum } = useWallet()
  const { lpTokenAddress, pid } = farm

  const lpContract = useMemo(
    () => {
      return getContract(ethereum as provider, lpTokenAddress)
    },
    [ethereum, lpTokenAddress]
  )

  const sushi = useSushi()
  const poolContract = getMasterChefContract(sushi)

  const { onStake } = useStake(pid, poolContract)
  const { onUnstake } = useUnstake(pid, poolContract)

  const { t } = useTranslation()
  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)

  return !!account ? (
    <>
      <td>
        <div className="pool-card__action">
          <Harvest pid={farm.pid} />
        </div>
      </td>
      <td>
        <div className="pool-card__action">
          <Stake
            onStake={onStake}
            onUnstake={onUnstake}
            onClick={onClick}
            poolContract={poolContract}
            tokenContract={lpContract}
            pid={farm.pid}
            tokenName={farm.lpToken}
            uniswap={farm.uniswap}
          />
        </div>
      </td>
    </>
  ) : (
    <td>
      <div className="pool-card__action">
        <Button
          onClick={onPresentWalletProviderModal}
          text={t('wallet.unlock')}
        />
      </div>
    </td>
  )
}

export default PoolCards
