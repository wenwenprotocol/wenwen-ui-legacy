import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'

import Value from '../../../components/Value'
import useSushi from '../../../hooks/useSushi'
import { getSushiPrice } from '../../../sushi/utils'
import { bnToDec } from '../../../utils'

const ShareCard: React.FC = ({  }) => {
  const [price, setPrice] = useState(new BigNumber(0))

  const sushi = useSushi()

  useEffect(() => {
    async function fetchSushiPrice() {
      const price = await getSushiPrice(sushi)

      setPrice(price)
    }

    if (sushi) {
      fetchSushiPrice()
    }
  }, [sushi, setPrice])

  return (
    <StyledMod>
      <StyledModHd>SHARE Price</StyledModHd>
      <StyledModBd>
        <Value
          value={bnToDec(price, 12)}
        />
      </StyledModBd>
      <StyledModFt>
      </StyledModFt>
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


export default ShareCard
