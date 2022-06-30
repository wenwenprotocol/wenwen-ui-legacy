import React from 'react'
import styled from 'styled-components'

import CashCard from './CashCard'

import useCashesPrices from '../../../hooks/useCashesPrices'
import useSharePrice from '../../../hooks/useSharePrice'

const Prices: React.FC = () => {
  const sharePrice = useSharePrice()
  const cashWithPrice = useCashesPrices()

  const rows = [...cashWithPrice, sharePrice]

  const n = rows.length % 3

  if (n) {
    for (let i = 0; i < 3 - n; i++) {
      rows.push({ name: '', price: 0 })
    }
  }

  return (
    <StyledWrap>
      { rows.map(({ name, price }, i) => <CashCard key={i} cash={name} price={price} />)}
    </StyledWrap>
  )
}

const StyledWrap = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
 `

export default Prices
