import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Button from '../../../components/Button'
import PoolCards from '../../Pools/components/PoolCard'

const Mining: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Container>
      <Title>{t('home.mining')}</Title>
      <SubTitle>{t('home.mining_desc')}</SubTitle>
      <Action>
        <Button text={t('home.farm')} to="/farm" />
      </Action>
      <Wrapper>
        <PoolCards />
      </Wrapper>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 100px;
  margin-bottom: 150px;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: start;
  width: 80%;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    width: 90%;
  }
`

const Title = styled.h2`
  color: #ffffff;
  font-weight: 600;
  font-size: 36px;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    font-size: 28px;
    line-height: 40px;
  }
`

const SubTitle = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: #A8B0C1;
  text-align: center;
  width: 50%;
`

const Action = styled.div`
  width: 200px;
  margin: 30px 0 50px 0;
`

export default Mining