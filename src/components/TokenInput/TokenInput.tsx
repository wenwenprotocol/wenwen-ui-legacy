import React from 'react'
import styled from 'styled-components'

import Button from '../Button'
import Input, { InputProps } from '../Input'
import { useTranslation } from 'react-i18next'

interface TokenInputProps extends InputProps {
  max: number | string,
  symbol: string,
  onSelectMax?: () => void,
  link?: string
}

const TokenInput: React.FC<TokenInputProps> = ({
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
  link,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <StyledHd>
        <div>
          <StyledMaxText>{t('farm.available', { symbol })}</StyledMaxText>
          <StyledBalance>{max.toLocaleString()}</StyledBalance>
        </div>
        { link
          ? <StyledLink><a href={link} target="_blank" rel="noopener noreferrer">{t('farm.add_liquidity')}</a></StyledLink> 
          : null
        }
      </StyledHd>
      <StyledBd>
        <StyledInput>
          <Input
            onChange={onChange}
            placeholder="0"
            value={value}
          />
        </StyledInput>
        <StyledBtn>
          <Button text={t('max')} onClick={onSelectMax} />
        </StyledBtn>
      </StyledBd>
    </>
  )
}

const StyledHd = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledInput = styled.div`
  flex-grow: 1;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    width: 70%;
  }
`

const StyledBalance = styled.div`
  margin: 12px 0 30px;
  font-size: 32px;
  line-height: 38px;
  color: #fff;
  @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
    font-size: 24px;
  }
`

const StyledLink = styled.div`
  padding-top: 32px;

  a {
    color: #fff;
    // text-decoration: none;
  }
`

const StyledBd = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledMaxText = styled.div`
  font-size: 12px;
  line-height: 14px;
  color: #A8B0C1;
`

const StyledBtn = styled.div`
  width: 80px;
  margin-left: 10px;
`

export default TokenInput
