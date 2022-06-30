import React from 'react'
import styled from 'styled-components'
import Page from '../../components/Page'
import Spacer from '../../components/Spacer'
import Button from '../../components/Button'
import Banner from './components/Banner'
import Tokens from './components/Tokens'
import Stability from './components/Stability'
import Mining from './components/Mining'
import { useTranslation } from 'react-i18next'
import { getDocUrl } from '../../utils'

const Home: React.FC = () => {
  const { t, i18n } = useTranslation()

  return (
    <Page>
      <Bd>
        <Slogan>
          <Title>
            {t('home.title')}
          </Title>
          <Subtitle>
          {t('home.subtitle')}
          </Subtitle>
          <Buttons>
            <Button text={t('home.cta')} to="/exchange" />
            <Spacer width="10%" />
            <Btn href={getDocUrl(i18n)} target="_blank">{t('home.more')}</Btn>
          </Buttons>
        </Slogan>
        <BannerWrap>
          <Banner />
        </BannerWrap>
      </Bd>
      <Tokens />
      <Stability />
      <Mining />
    </Page>
  )
}

const Bd = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 100px;
  box-sizing: border-box;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    padding: 20px;
    flex-direction: column-reverse;
    align-items: center;
  }
`

const Slogan = styled.div`
  flex-grow: 1;
  flex-shrink: 0
  flex-basis: 45%;
  margin-right: 64px;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    margin-right: 0;
    text-align: center;
  }
`

const Title = styled.h1`
  font-weight: 600;
  font-size: 48px;
  line-height: 67px;
  color: #FFFFFF;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    font-size: 28px;
    line-height: 40px;
  }
`

const Subtitle = styled.h3`
  font-size: 14px;
  line-height: 20px;
  color: #A8B0C1;
`

const Buttons = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`

const BannerWrap = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 50%;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    width: 50%;
  }
`
const Btn = styled.a`
  border: 1px solid #41a558;
  height: 56px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  flex-grow: 1;
  flex-shrink: 0;
  color: #fff;
  text-decoration: none;
  box-sizing: border-box;
  flex-basis: 45%;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    width: 100%;
    padding: 18px 20px;
  }
`

export default Home
