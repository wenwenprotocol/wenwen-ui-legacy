import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

interface IconButtonProps {
  children?: React.ReactNode
  disabled?: boolean
  onClick?: () => void
  to?: string
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  disabled,
  onClick,
  to,
}) => {
  return (
    <StyledButton disabled={disabled} onClick={onClick}>
      {!!to ? <StyledLink to={to}>{children}</StyledLink> : children}
    </StyledButton>
  )
}

interface StyledButtonProps {
  disabled?: boolean
}

const StyledButton = styled.button<StyledButtonProps>`
  align-items: center;
  background: linear-gradient(95.78deg, #41A558 -0.9%, #44A69B 100%);
  border: 0;
  border-radius: 2px;
  color: ${(props) =>
    !props.disabled
      ? '#ffffff'
      : props.theme.color.grey[400]};
  cursor: pointer;
  display: flex;
  font-weight: 700;
  height: 56px;
  justify-content: center;
  letter-spacing: 1px;
  outline: none;
  padding: 0;
  margin: 0;
  pointer-events: ${(props) => (!props.disabled ? undefined : 'none')};
  text-transform: uppercase;
  width: 56px;
  font-size: 24px;

  &:hover {
    background-color: ${(props) => props.theme.color.grey[100]};
  }
`

const StyledLink = styled(Link)`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  margin: 0 ${(props) => -props.theme.spacing[4]}px;
  padding: 0 ${(props) => props.theme.spacing[4]}px;
  text-decoration: none;
`

export default IconButton
