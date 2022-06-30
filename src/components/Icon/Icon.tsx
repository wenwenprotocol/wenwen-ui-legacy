import React, { useContext } from 'react'
import styled from 'styled-components'
import { ThemeContext } from 'styled-components'

export interface IconProps {
  color?: string
  children?: React.ReactNode
  size?: number
  onClick?: () => void
}

const Icon: React.FC<IconProps> = ({ children, color, size = 24, onClick }) => {
  const { color: themeColor } = useContext(ThemeContext)
  return (
    <StyledIcon onClick={onClick}>
      {React.isValidElement(children) && React.cloneElement(children, {
        color: color || themeColor.grey[400],
        size,
      })}
    </StyledIcon>
  )
}

const StyledIcon = styled.div`
  display: flex;
  align-items: center;
`

export default Icon