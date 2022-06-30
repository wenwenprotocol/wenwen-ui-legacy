import React from 'react'
import styled from 'styled-components'

import Page from '../../components/Page'
import Container from '../../components/Container'
import PoolCard from './components/PoolCard'
import PageHeader from '../../components/PageHeader'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

const Pools: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <Helmet>
        <title>Farm</title>
      </Helmet>
      <PageHeader title={t('farm.title')} subtitle={t('farm.subtitle')}/>
      <Container size="lg">
        <StyledWrap>
          <StyledPagePoolsBd>
            <PoolCard />
          </StyledPagePoolsBd>
        </StyledWrap>
      </Container>
    </Page>
  )
}

const StyledWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 60px;
`

const StyledPagePoolsBd = styled.div`
  display: flex;
  justify-content: space-around;
`

export default Pools
