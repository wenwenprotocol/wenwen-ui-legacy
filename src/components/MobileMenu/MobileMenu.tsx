import React from 'react'
import styled, { keyframes } from 'styled-components'
import { NavLink } from 'react-router-dom'
import Logo from '../Logo'
import CloseIcon from '../icons/CloseIcon'
import LangSwicher from '../LangSwicher'
import { useTranslation } from 'react-i18next'
import Icon from '../Icon'
import Nav from '../Footer/components/Nav'
import ChainSwicher from '../ChainSwicher'
interface MobileMenuProps {
  onDismiss: () => void
  visible?: boolean
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onDismiss, visible }) => {
  const { t } = useTranslation()
  if (visible) {
    return (
      <StyledMobileMenuWrapper>
        <StyledBackdrop onClick={onDismiss} />
        <StyledMobileMenu>
          <StyledHeader>
            <Logo />
            <Icon onClick={onDismiss}><CloseIcon /></Icon>
          </StyledHeader>
          <StyledContent>
            {/* <ChainSwicher /> */}
            <StyledNav>
              <StyledLink exact activeClassName="active" to="/" onClick={onDismiss}>
                {t('nav.exchange')}
              </StyledLink>      
              <StyledLink exact activeClassName="active" to="/farm" onClick={onDismiss}>
                {t('nav.farm')}
              </StyledLink>
              <StyledLink exact activeClassName="active" to="/stake" onClick={onDismiss}>
                {t('nav.stake')}
              </StyledLink>
              <StyledLink exact activeClassName="active" to="/analytics" onClick={onDismiss}>
                {t('nav.analytics')}
              </StyledLink>  
            </StyledNav>
            <LangSwicher />
            <Nav />
          </StyledContent>
        </StyledMobileMenu>
      </StyledMobileMenuWrapper>
    )
  }
  return null
}

const StyledBackdrop = styled.div`
  background: rgba(14, 13, 22, 0.7);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

const StyledMobileMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
`

const slideIn = keyframes`
  0% {
    transform: translateX(0)
  }
  100% {
    transform: translateX(-100%);
  }
`

const StyledMobileMenu = styled.div`
  animation: ${slideIn} 0.3s forwards ease-out;
  background: rgba(14, 13, 22, 0.5);
  backdrop-filter: blur(40px);
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: start;
  position: absolute;
  top: 0;
  left: 100%;
  bottom: 0;
  width: 80%;
`

const StyledLink = styled(NavLink)`
  box-sizing: border-box;
  color: ${(props) => props.theme.color.grey[400]};
  font-size: 18px;
  padding: ${(props) => props.theme.spacing[3]}px 0;
  text-decoration: none;
  width: 100%;
  &:hover {
    color: ${(props) => props.theme.color.grey[500]};
  }
  &.active {
    color: ${(props) => props.theme.color.grey[100]};
  }
`

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
`

const StyledNav = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  margin: 30px 0;
`

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 ${(props) => props.theme.spacing[6]}px;
`

export default MobileMenu
