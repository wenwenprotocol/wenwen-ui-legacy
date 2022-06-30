import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { isMobile } from 'react-device-detect'
import { Helmet } from 'react-helmet-async'

import Page from '../../components/Page'

import Value from '../../components/Value'
import Tooltip, { TooltipBoxProps }  from '../../components/Tooltip'
import { bnToDec } from '../../utils'

import useCashesPrices from '../../hooks/useCashesPrices'
import useSharePrice from '../../hooks/useSharePrice'
import useShareTotalSupply from '../../hooks/useShareTotalSupply'
import useCashesBalances from '../../hooks/useCashesBalances'
import useVaultWbtcBalance from '../../hooks/useVaultWbtcBalance'
import useSushi from '../../hooks/useSushi'
import useVaultCashesBalance from '../../hooks/useVaultCashesBalance'
import useBtcPrice from '../../hooks/useBtcPrice'
import useIsMountedRef from '../../hooks/useIsMountedRef'
import { useTranslation } from 'react-i18next'
import useCountDown, { CountDownTime } from '../../hooks/useCountDown'

import { 
  getVaultOwnedShare, 
  getVaultAddress, 
  getSushiContract,
} from '../../sushi/utils'

import { INTEGERS } from '../../sushi/lib/constants'

interface ItemProps extends TooltipBoxProps{
  children?: React.ReactNode
  label: string
  tip?: string
}

const Item: React.FC<ItemProps> = ({ label, children, tip, placement }) => {
  return (
    <StyledItem>
      <StyledValue>
        {children ? children : null}
      </StyledValue>
      <StyledLabel>
        <StyledBd>
          <span style={{ marginRight: '10px' }}>{label ? label: ''}</span>
          {tip ? <Tooltip tip={tip} placement={placement}>?</Tooltip> : null}
        </StyledBd>
      </StyledLabel>
    </StyledItem>
  )
}

interface LinkItemProps {
  children?: React.ReactNode,
  label: string | React.ReactNode,
  isShow?: boolean
}

export const LinkItem: React.FC<LinkItemProps> = ({ label, isShow = true, children }) => {
  return (
    <StyledItem>
      <StyledValue>
        {children ? children : null}
      </StyledValue>
      <StyledLabel>
        {
          isShow
          ? (
            <div>
              {label}
            </div>
          )
          : null
        }
      </StyledLabel>
    </StyledItem>
  )
}

interface CountDownItemProps extends ItemProps {
  time: CountDownTime
}

const CountDownItem: React.FC<CountDownItemProps> = ({ label, tip, time }) => {
  const { t } = useTranslation()
  return (
    <Item label={label} tip={tip}>
      <StyledCountDownTime>
        <Value value={time ? time.hours : 0} decimals={0}/> 
        <span>{t('analytics.hrs')}</span> 
        <Value value={time ? time.minutes: 0} decimals={0}/> 
        <span>{t('analytics.mins')}</span>
      </StyledCountDownTime>
    </Item>
  )
}

const Status: React.FC = () => {
  const { t } = useTranslation()
  const sushi = useSushi()

  const cashWithPrice = useCashesPrices()

  const share = useSharePrice()
  const shareTotalSupply = useShareTotalSupply()
  const vaultWbtcBalance = useVaultWbtcBalance()
  const cashTotalSupply = useCashesBalances()

  const btcPrice = useBtcPrice()
  const isMountedRef = useIsMountedRef()

  const vaultAddress = getVaultAddress(sushi)
  const shareContract = getSushiContract(sushi)

  const [vaultOwnedShare, setVaultOwnedShare] = useState(new BigNumber(0))

  useEffect(() => {
    async function fetchVaultOwnedShare() {
      const amount = await getVaultOwnedShare(shareContract, vaultAddress)
      if (isMountedRef.current) {
        setVaultOwnedShare(amount)
      }
    }

    if (shareContract && vaultAddress) {
      fetchVaultOwnedShare()
    }

  }, [sushi, shareContract, vaultAddress, setVaultOwnedShare, isMountedRef])

  let vaultCashesBalance = useVaultCashesBalance()
  
  const [circulatingValue, setCirculatingValue] = useState(0)

  useEffect(() => {
    const circulatingValue = cashTotalSupply.reduce((value, cash) => {
      const cashPrice = cashWithPrice.find(cashPrice => cashPrice.name === cash.name)
      const vaultCash = vaultCashesBalance.find(vaultCash => vaultCash.cash === cash.name)
      return cashPrice && vaultCash && (value + (bnToDec(cash.totalSupply) -  bnToDec(vaultCash.balance)) *  bnToDec(cashPrice.price, 12))
    }, 0)

    setCirculatingValue(circulatingValue)
  }, [cashTotalSupply, cashWithPrice, vaultCashesBalance])

  const rows = cashWithPrice.map(cashPrice => ({
    cashPrice,
    cashSupply: cashTotalSupply.find(cash => cash.name === cashPrice.name)
  }))

  const repurchaseCountDown = useCountDown(INTEGERS.REPURCHASE_UTC_TIME)
  const restableCountDown = useCountDown(INTEGERS.RESTABLE_UTC_TIME)
  const shouldOperate = cashWithPrice.reduce((result, cash) => { 
    return result || cash.price.minus(cash.targetPrice).div(cash.targetPrice).abs().gte(0.01)
  }, false)

  type Link = {
    [key: string]: string
  }

  const LINK_MAP: Link = {
    USDN: 'https://app.uniswap.org/#/swap?inputCurrency=0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599&outputCurrency=0x4bC831111B480f07b7F74DBE90726f3b11201033&use=V2',
    JPYN: 'https://app.uniswap.org/#/swap?inputCurrency=0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599&outputCurrency=0x95E91a76f225612995043AB26A98E6a4E3e1999b&use=V2',
    EURN: 'https://app.uniswap.org/#/swap?inputCurrency=0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599&outputCurrency=0x96dc9e0fE87EEf0b48f88d6aC541ba4F9992aac6&use=V2',
    SHAREN: 'https://app.uniswap.org/#/swap?inputCurrency=0x4bC831111B480f07b7F74DBE90726f3b11201033&outputCurrency=0x772C316e0A7Ab5f1DE6de5199A22c951254C5CD3&use=V2'
  }

  return (
    <Page>
      <Helmet>
        <title>Analytics</title>
      </Helmet>
      <StyledWrap>
        <StyledMod>
          <StyledHd>{t('analytics.stablecoins')}</StyledHd>
          {
            rows.length ?
              rows.map(({ cashPrice, cashSupply }, i) =>
              (
                <StyledBd key={i}>
                  <LinkItem label={
                      <StyledBd>
                        <a href={LINK_MAP[cashPrice.name]} target="_blank" rel="noopener noreferrer">{cashPrice.name}</a>
                        <span>{t('analytics.price')}</span>
                        <span>/</span>
                        <span>{t('analytics.offset')}</span>
                        <Tooltip tip={t('analytics.twap')}>?</Tooltip>
                      </StyledBd>
                    } 
                    isShow={!!cashPrice.name}>
                    { cashPrice.name ?
                      <StyledPrice>
                        $
                        {cashPrice.name ? <Value
                          value={bnToDec(cashPrice.price, 12)}
                          decimals={6}
                        /> : null}
                        <StyledSpacer>/</StyledSpacer>
                        <StyledOffset>
                          {cashPrice.name ? `${((bnToDec(cashPrice.price, 12) - bnToDec(cashPrice.targetPrice, 12)) / bnToDec(cashPrice.targetPrice, 12) * 100).toFixed(2)}%` : '0%'}
                        </StyledOffset>
                      </StyledPrice> : null}
                    </LinkItem>
                  {
                    cashSupply && cashSupply.name ? 
                    <LinkItem label={<><a href={LINK_MAP[cashSupply.name]} target="_blank" rel="noopener noreferrer">{cashSupply.name}</a><span>{t('analytics.supply')}</span></>} isShow={!!cashSupply.name}>
                      <StyledPrice>
                        {cashSupply.name ? <Value
                          value={bnToDec(cashSupply.totalSupply)}
                          decimals={0}
                        /> : null}
                      </StyledPrice>
                    </LinkItem> : null
                  }
                </StyledBd>                    
              )) : null
          }
          <StyledBd>
            <CountDownItem 
              label={t('analytics.time_until_repurchase')}
              tip={t('analytics.repurchase_tip', { time: INTEGERS.REPURCHASE_UTC_TIME })}
              time={shouldOperate ? repurchaseCountDown : null}
            />
            {/* <CountDownItem 
              label={t('analytics.time_until_restable')}
              tip={t('analytics.restable_tip', { time: INTEGERS.RESTABLE_UTC_TIME })}
              time={shouldOperate ? restableCountDown : null}
            />          */}
          </StyledBd>
        </StyledMod>
        <StyledMod>
          <StyledHd>SHAREN</StyledHd>
          <StyledBd>
            <LinkItem label={
                <StyledBd>
                  <a href={LINK_MAP.SHAREN} target="_blank" rel="noopener noreferrer">SHAREN</a>
                  <span>{t('analytics.price')}</span>
                  <Tooltip tip={t('analytics.twap_sharen')}>?</Tooltip>
                </StyledBd>
              }>
              <StyledFlex>
                <StyledIn>
                  $<Value
                    value={bnToDec(share.price, 12).toFixed(4)}
                  />
                </StyledIn>
              </StyledFlex>
            </LinkItem>              
            <LinkItem label={<><a href={LINK_MAP.SHAREN} target="_blank" rel="noopener noreferrer">SHAREN</a><span>{t('analytics.supply')}</span></>}>
              {shareTotalSupply ? (
                <Value
                  value={bnToDec(shareTotalSupply)}
                  decimals={0}
                />
              ) : null}
            </LinkItem>
          </StyledBd>
        </StyledMod>
        <StyledMod>
          <StyledHd>{t('analytics.vault')}</StyledHd>
          <StyledBd>
            <Item label={t('analytics.pcv')} tip={t('analytics.pcv_tip')}>
              {btcPrice && vaultWbtcBalance ?
                (<StyledFlex>
                  <StyledIn>
                    $<Value
                      value={bnToDec(btcPrice, 8) * bnToDec(vaultWbtcBalance, 8)}
                      decimals={0}
                    /></StyledIn>
                </StyledFlex>)
                : null}
            </Item>
            <Item label={t('analytics.owned_by_vault', { tokenName: 'WBTC' })}>
              <Value
                value={bnToDec(vaultWbtcBalance, 8)}
              />
            </Item>
          </StyledBd>
          <StyledBd>                         
            <Item label={t('analytics.circulating')} tip={t('analytics.circulating_tip')}>
              {circulatingValue ?
                (<StyledFlex>
                  <StyledIn>
                    $<Value
                      value={circulatingValue}
                      decimals={0}
                    /></StyledIn>
                </StyledFlex>)
                : null}
            </Item>
            <Item 
              label={t('analytics.collateralization')} 
              tip={t('analytics.collateralization_tip')}
              placement={isMobile ? 'left' : 'bottom'}
            >
              {circulatingValue > 0 ? `${(bnToDec(btcPrice, 8) * bnToDec(vaultWbtcBalance, 8) / circulatingValue * 100).toFixed(2)}%` : '0%'}
            </Item>
          </StyledBd>
          <StyledBdWrap>                                   
            {vaultCashesBalance.length ?
              vaultCashesBalance.map(({ cash, balance }) => (
                <Item label={cash ? t('analytics.owned_by_vault', { tokenName: cash }) : ''} key={cash}>
                  {cash ?
                    <Value
                      value={bnToDec(balance)}
                      decimals={0}
                    />
                    : null
                  }
                </Item>
              ))
              : null}
            <Item label={t('analytics.owned_by_vault', { tokenName: 'SHAREN' })}>
              <Value
                value={bnToDec(vaultOwnedShare)}
                decimals={0}
              />
            </Item>          
          </StyledBdWrap>
        </StyledMod>
      </StyledWrap>
    </Page>
  )
}

const StyledWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-height: calc(100vh - 237px);
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
  margin-bottom: 60px;
`

const StyledMod = styled.div`
  margin: 40px 0;
`

const StyledHd = styled.div`
  font-weight: bold;
  font-size: 36px;
  line-height: 48px;
  text-transform: uppercase;
  color: #FFFFFF;
  text-align: center;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    font-size: 28px;
    line-height: 36px;
  }
`

const StyledBd = styled.div`
  display: flex;
  justify-content: space-around;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    padding: 0 10px;
  }
`

const StyledBdWrap = styled(StyledBd)`
  flex-flow: wrap;
`

const StyledItem = styled.div`
  margin-top: 70px;
  flex-basis: 48%;
  text-align: center;
`

const StyledValue = styled.div`
  font-family: 'DDIN';
  font-size: 42px;
  color: #fff;
  font-weight: bold;
  line-height: 50px;
  letter-spacing: 0.04em;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    font-size: 24px;
    line-height: 36px;
  }
`

const StyledLabel = styled.div`
  font-size: 14px;
  color: #A8B0C1;
  text-transform: capitalize;
  display: flex;
  justify-content: space-around;
  align-items: center;

  a {
    color: #A8B0C1;
    margin-right: 5px;
  }

  span {
    margin-right: 5px;
  }
`

const StyledFlex = styled.div`
  font-size: 42px;
  color: #fff;
  font-weight: bold;
  line-height: 50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    font-size: 24px;
    line-height: 36px;
  }
`
const StyledIn = styled.div`
  display: felx;
  align-items: center;
`

const StyledPrice = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledSpacer = styled.div`
  margin: 0 5px;
  color: #A8B0C1;
  font-size: 26px;
`

const StyledOffset = styled.div`
  font-family: 'DDIN','Roboto Mono',monospace;
  font-size: 36px;
  font-weight: 700;
  line-height: 43px;
  color: #fff;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    font-size: 24px;
    line-height: 32px;
  }
`

const StyledCountDownTime = styled.div`
  display: flex;
  justify-content: center;
  & > span {
    font-size: 24px;
    margin: 0 5px;
  }
`

export default Status
