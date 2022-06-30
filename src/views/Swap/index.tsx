import React from 'react'
import { Helmet } from 'react-helmet-async'

import Page from '../../components/Page'
import Container from '../../components/Container'
import Value from '../../components/Value'
import Button from '../../components/Button'
import PageHeader from '../../components/PageHeader'
import Coins from '../../components/Coins'

import useFarms from '../../hooks/useFarms'
import useAllLiquidity from '../../hooks/useAllLiquidity'
import { useTranslation } from 'react-i18next'
import { bnToDec } from '../../utils'
import { isBrowser } from 'react-device-detect'
import './index.css'
import { Farm } from '../../contexts/Farms'
import { getDocUrl } from '../../utils'

const Swap: React.FC = () => {
  const farms = useFarms()
  const liquidity = useAllLiquidity()

  const getSwapLink = (farm: Farm) => {
    const { inputTokenAddress, cashTokenAddress } = farm
    return `https://app.uniswap.org/#/swap?inputCurrency=${inputTokenAddress}&outputCurrency=${cashTokenAddress}&use=V2`
  }

  const { t, i18n } = useTranslation()

  return (
    <div className="page-swap">
      <Helmet>
          <title>Exchange</title>
      </Helmet>
      <Page>
        <PageHeader title={t('exchange.title')} subtitle={t('exchange.subtitle')}>
          <Button 
            size="sm" 
            href={getDocUrl(i18n, 'how-to-guides/how-to-add-token-list')} 
            variant="secondary"
            text={t('exchange.add_token_list')}
          />
        </PageHeader>
        <Container size="lg">
          <div className="wrap">
            <table className="swap-cards">
              <tbody>
                {farms.map((farm, i) => 
                  (
                    <tr className="pool-column" key={farm.id}>
                      <td>
                        <div className="name">
                          <Coins coins={farm.lpToken.slice(0, -3).split('-')} />
                          <span>{farm.lpToken.split(' ')[0]}</span>
                        </div>
                      </td>
                      {isBrowser ? 
                        <td>
                          <div className="label">{t('exchange.liquidity')}</div>
                          <div className="value">$
                            {liquidity[i] ? <Value value={bnToDec(liquidity[i], 0)} decimals={0} /> : '-'}
                          </div>
                        </td> : null }
                        <td>
                            <div className="op">
                              <Button size="sm" href={getSwapLink(farm)} text={isBrowser ? t('exchange.swap_on_uniswap') : t('exchange.swap')} />
                            </div>
                        </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </Container>
      </Page>
    </div>
  )
}

export default Swap