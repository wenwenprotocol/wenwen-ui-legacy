import React from 'react'
import styled from 'styled-components'
import { isBrowser } from 'react-device-detect'
import Logo from '../../components/Logo/Logo'
import AccountButton from './components/AccountButton'
import Nav from './components/Nav'
import LangSwicher from '../LangSwicher'
import MenuIcon from '../icons/MenuIcon'
import Warning from '../icons/Warning'
import Icon from '../Icon'
import Container from '../../components/Container'
import Button from '../Button'
import { useTranslation } from 'react-i18next'
interface TopBarProps {
  onPresentMobileMenu: () => void
}

const TopBar: React.FC<TopBarProps> = ({ onPresentMobileMenu }) => {
  const { t } = useTranslation()
  return (
    <StyledTopBar>
      <StyledTopBarContent>
        <StyledTopBarLeft>
          <Logo />
          {isBrowser ? <StyledNavWrap><Nav /></StyledNavWrap> : null}
        </StyledTopBarLeft>
        <StyledTopBarRight>
          {/* {isBrowser ?<StyledChainSwicherWrapper>
            <ChainSwicher />
          </StyledChainSwicherWrapper> : null} */}
          <StyledAccountButtonWrapper>
            <AccountButton />
          </StyledAccountButtonWrapper>
          {isBrowser ? <LangSwicher /> : null}
        </StyledTopBarRight>
        <StyledMenuButton onClick={onPresentMobileMenu}>
            <Icon><MenuIcon /></Icon>
        </StyledMenuButton>
      </StyledTopBarContent>
      <StyledTopBarNotice>
        <Container size="lg">
          <StyledNoticeContent>
            <StyledNoticeText>
              <StyledNoticeTextIcon>
                <Icon color='white'><Warning /></Icon>
              </StyledNoticeTextIcon>
              {t('shut_down_notice')}
            </StyledNoticeText>
            <div>
              <Button text={t('stake.learn_more')} href="https://wenwenprotocol.medium.com/end-of-service-announcement-44c02044ffb0" size="sm" variant="whiteframe" />
            </div>
          </StyledNoticeContent>
        </Container>
      </StyledTopBarNotice>
    </StyledTopBar>
  )
}

const StyledTopBar = styled.div`
  position: fixed;
  z-index: 15;
  box-sizing: border-box;
  width: 100%;
  backdrop-filter: blur(31px);
`

const StyledTopBarLeft = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  max-width: ${(props) => props.theme.siteWidth}px;
`

const StyledTopBarRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const StyledNavWrap = styled.div`
  margin-left: 90px;  
`

const StyledAccountButtonWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  z-index: 15;
  margin-right: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    justify-content: center;
    margin: 0;
  }
`

const StyledChainSwicherWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  z-index: 15;
  margin-right: 20px;
`

const StyledMenuButton = styled.button`
  background: none;
  border: 0;
  margin: 0;
  outline: 0;
  padding: 0;
  display: none;
  color: ${props => props.theme.color.grey[400]};
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    align-items: center;
    display: flex;
    height: 36px;
    justify-content: center;
    width: 36px;
  }
`

const StyledTopBarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  height: 100px;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    position: relative;
    justify-content: space-between;
    padding: 0 25px;
    height: 80px;
  }
`

const StyledTopBarNotice = styled.div`
  padding: 15px 0px;
  background: linear-gradient(95.78deg, #41A558 -0.9%, #44A69B 100%);
  color: white;
`

const StyledNoticeContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    flex-direction: column;
    align-items: start;
  }
`

const StyledNoticeText = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    margin-bottom: 20px;
  }
`

const StyledNoticeTextIcon = styled.div`
  margin-right: 10px;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    display: none;
  }
`

export default TopBar
