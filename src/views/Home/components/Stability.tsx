import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import useCashesPrices from '../../../hooks/useCashesPrices'
import Value from '../../../components/Value'
import { bnToDec } from '../../../utils'

const Stability: React.FC = () => {
  const { t } = useTranslation()
  const cashPrices = useCashesPrices()
  return (
    <Container>
      <Title>{t('home.stability')}</Title>
      <Wrapper>
        <Content>
          <ContentItem>
            <ContentTitle>{t('home.above_peg')}</ContentTitle>
            <Desc>{t('home.above_odd')}</Desc>
            <Desc>{t('home.above_even')}</Desc>
          </ContentItem>
          <ContentItem>
            <ContentTitle>{t('home.below_peg')}</ContentTitle>
            <Desc>{t('home.below_odd')}</Desc>
            <Desc>{t('home.below_even')}</Desc>             
          </ContentItem>       
        </Content>        
        <PriceCard>
          {cashPrices.length ? 
            cashPrices.map(({ name, price, targetPrice }) => (
              <PriceItem key={name}>
                <StyledLabel><span>{name} {t('analytics.price_offset')}</span></StyledLabel>
                <StyledValue>
                  { name ?
                    <StyledPrice>
                      $
                      {name ? <Value
                        value={bnToDec(price, 12)}
                        decimals={6}
                      /> : null}
                      <StyledSpacer>/</StyledSpacer>
                      <StyledOffset>
                        {name ? `${((bnToDec(price, 12) - bnToDec(targetPrice, 12)) * 100).toFixed(2)}%` : '0%'}
                      </StyledOffset>
                    </StyledPrice> : null}
                  </StyledValue>
              </PriceItem>            
              )) : null} 
        </PriceCard>
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
`

const Wrapper = styled.div`
  display: flex;
  justify-content: start;
  width: 100%;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`

const Title = styled.h2`
  color: #ffffff;
  font-weight: 600;
  font-size: 36px;
  margin-bottom: 70px;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    font-size: 28px;
    line-height: 40px;
  }
`

const StyledPrice = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    font-size: 24px;
    line-height: 36px;
  }
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

const PriceItem = styled.div`
  text-align: center;
`

const PriceCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 300px;
  // background: linear-gradient(95.78deg, #41A558 -0.9%, #44A69B 100%);
  border: 1px solid #41a558;
  padding: 20px 60px;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    padding: 20px 50px;
  }
`

const StyledValue = styled.div`
  font-family: 'DDIN';
  font-size: 42px;
  color: #fff;
  font-weight: bold;
  line-height: 50px;
  letter-spacing: 0.04em;
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

const Content = styled.div`
  padding-right: 60px;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    padding: 0 20px;
    margin-top: 60px;
    text-align: center;
  }
`

const ContentItem = styled.div`
  &:first-child {
    margin-bottom: 60px;
  }
`

const ContentTitle = styled.h3`
  color: #ffffff;
  font-weight: 600;
  font-size: 24px;
  margin: 0 auto;
  margin-bottom: 20px;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    font-size: 18px;
  }
`

const Desc = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: #A8B0C1;
  text-align: left;
`

export default Stability