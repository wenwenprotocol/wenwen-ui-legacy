import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'

import Value from '../../../components/Value'
import { bnToDec } from '../../../utils'

interface CashCardProps {
  cash: string,
  price: BigNumber
}

const CashCard: React.FC<CashCardProps> = ({ cash, price  } : {cash: string, price: BigNumber}) => {
  return (
    <StyledMod>
      { cash ? 
      (
        <>
          <StyledModHd>{cash} Price</StyledModHd>
          <StyledModBd>
            <Value
              value={bnToDec(price, 12)}
            />
          </StyledModBd>
          <StyledModFt>
          </StyledModFt>
        </>
      )
      : null }
    </StyledMod>
  )
}

const StyledMod  = styled.div`
  flex-basis: 30%;
  margin-bottom: 50px
`
const StyledModHd = styled.div`
font-size: 12px;
line-height: 14px;
text-transform: capitalize;
color: #A8B0C1;
`

const StyledModBd = styled.div`
font-weight: 600;
font-size: 36px;
line-height: 43px;
color: #FFFFFF;
margin: 30px 0 10px;
`
const StyledModFt = styled.div`
font-size: 12px;
line-height: 17px;
color: #A8B0C1;
`

export default CashCard
