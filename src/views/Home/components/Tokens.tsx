import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import stableCoinsIcon from '../../../assets/img/stablecoins.svg'
import sharenIcon from '../../../assets/img/SHAREN.svg'
import { getDocUrl } from '../../../utils'
import Button from '../../../components/Button'

const Tokens: React.FC = () => {
  const { t, i18n } = useTranslation()
  return (
    <Container>
      <Title>{t('home.dual_token')}</Title>
      <Cards>
        <Card>
          <CardContent>
            <CardIcon src={stableCoinsIcon} alt="stablecoins" />
            <CardTitle>{t('home.stablecoins')}</CardTitle>
            <CardDesc>{t('home.stablecoins_desc')}</CardDesc>
          </CardContent>
          <Button text={t('home.cta')} to="/exchange" />
        </Card>
        <Card>
          <CardContent>
            <CardIcon src={sharenIcon} alt="SHAREN" />
            <CardTitle>SHAREN</CardTitle>
            <CardDesc>{t('home.sharen_desc')}</CardDesc>
          </CardContent>
          <Button text={t('home.more')} href={getDocUrl(i18n)} />
        </Card>
      </Cards>
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
  padding-top: 50px;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    padding-top: 100px;
  }
`

const Title = styled.h2`
  color: #ffffff;
  margin-bottom: 70px;
  font-weight: 600;
  font-size: 36px;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    font-size: 28px;
    line-height: 40px;
  }
`

const Cards = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    flex-direction: column;
    align-items: center;
    justify-content: start;
    width: 90%;
  }
`

const Card = styled.div`
  padding: 30px 20px;
  // background: rgba(14, 13, 22, 0.5);
  // backdrop-filter: blur(40px);
  border: 1px solid #41a558;
  // border: 1px solid rgba(168, 176, 193, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  width: 45%;
  min-height: 320px;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    width: 85%;
    &:first-child {
      margin-bottom: 60px;
    }
  }
`

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
`

const CardTitle = styled.h3`
  color: #ffffff;
  text-align: center;
  font-weight: 600;
  font-size: 24px;
  margin: 0 auto;
  margin-bottom: 20px;
`

const CardDesc = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: #A8B0C1;
`

const CardIcon = styled.img`
  height: 40px;
  margin-bottom: 30px;
`

export default Tokens