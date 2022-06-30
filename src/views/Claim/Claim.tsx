import React from 'react'
import styled from 'styled-components'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Reward from './components/Reward'
import StakedTokens from './components/StakedTokens'
import RewardPoolsProvider from '../../contexts/RewardPools'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import Button from '../../components/Button'
import { getDocUrl } from '../../utils'

const Claim: React.FC = () => {
  const { t, i18n } = useTranslation()

  return (
    <Page>
      <Helmet>
        <title>Stake</title>
      </Helmet>
      <PageHeader title={t('stake.title')} subtitle={t('stake.subtitle')}>
        <Button 
            size="sm" 
            href={getDocUrl(i18n, 'whitepaper/price-stability')} 
            variant="secondary"
            text={t('stake.learn_more')}
          />
      </PageHeader>
      <StyledMod>
        <StyledFt>
          <RewardPoolsProvider>
            <StyledClaim>
              <StakedTokens />
            </StyledClaim>                  
            <StyledClaim>
              <Reward />
            </StyledClaim> 
          </RewardPoolsProvider>
        </StyledFt>
      </StyledMod>
    </Page>
  )
}

const StyledMod = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: calc(100vh - 237px);
`

const StyledFt = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 50px;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    padding: 0 16px;
    flex-direction: column-reverse;
  }
`

const StyledClaim = styled.div`
  flex-basis: 45%;
  border: 1px solid rgba(168, 176, 193, 0.1);
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    margin-bottom: 30px;
  }
`

export default Claim
