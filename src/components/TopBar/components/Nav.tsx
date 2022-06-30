import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const Nav: React.FC = () => {
  const { t } = useTranslation()
  return (
    <StyledNav>
      <StyledLink exact activeClassName="active" to="/">
        {t('nav.exchange')}
      </StyledLink>      
      <StyledLink exact activeClassName="active" to="/farm">
        {t('nav.farm')}
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/stake">
        {t('nav.stake')}
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/analytics">
        {t('nav.analytics')}
      </StyledLink>    
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  height: 100px;
`

const StyledLink = styled(NavLink)`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #A8B0C1;
  padding-right: 60px;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.color.grey[100]};
  }
`

const Link = styled.a`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #A8B0C1;
  padding-right: 90px;
  text-decoration: none;
`

export default Nav
