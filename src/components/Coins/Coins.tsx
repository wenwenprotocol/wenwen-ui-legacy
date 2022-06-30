import React from 'react'
import styled from 'styled-components'
import USDN from '../../assets/img/USDN.svg'
import JPYN from '../../assets/img/JPYN.svg'
import EURN from '../../assets/img/EURN.svg'
import WBTC from '../../assets/img/WBTC.svg'
import SHAREN from '../../assets/img/SHAREN.svg'

interface CoinProps {
  coins: string[]
}

const Coins: React.FC<CoinProps> = ({ coins }) => {

  const coinUrls: any = {
    USDN,
    JPYN,
    EURN,
    WBTC,
    SHAREN,
  }

  return (
    <CoinsWrapper>
      { coins.length ? 
        coins.map(coin => (
          coinUrls[coin] ? <CoinImg src={coinUrls[coin] || null} key={coin} alt={coin} /> : null
        ))
      : null}
    </CoinsWrapper>
  )
}

const CoinsWrapper = styled.div`
  display: flex;
  align-items: center;
`

const CoinImg = styled.img`
  height: 36px;
  width: 36px;
  &~img {
    margin-left: -15px;
  }
`

export default Coins