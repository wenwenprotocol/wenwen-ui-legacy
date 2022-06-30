import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import CountUp from 'react-countup'

import Spacer from '../../../components/Spacer'
import Value from '../../../components/Value'

import useTokenBalance from '../../../hooks/useTokenBalance'
import useSushi from '../../../hooks/useSushi'
import useAllEarnings from '../../../hooks/useAllEarnings'
import useShareTotalSupply from '../../../hooks/useShareTotalSupply'

import { getSushiAddress } from '../../../sushi/utils'
import { getBalanceNumber } from '../../../utils/formatBalance'

const PendingRewards: React.FC = () => {
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)
  const [scale, setScale] = useState(1)

  const allEarnings = useAllEarnings()

  let sumEarning = 0

  for (let earning of allEarnings) {
    sumEarning += new BigNumber(earning)
      .div(new BigNumber(10).pow(18))
      .toNumber()
  }

  useEffect(() => {
    setStart(end)
    setEnd(sumEarning)
  }, [end, sumEarning])

  return (
    <span
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'right bottom',
        transition: 'transform 0.5s',
        display: 'inline-block',
      }}
    >
      <CountUp
        start={start}
        end={end}
        decimals={end < 0 ? 4 : end > 1e5 ? 0 : 3}
        duration={1}
        onStart={() => {
          setScale(1.25)
          setTimeout(() => setScale(1), 600)
        }}
        separator=","
      />
    </span>
  )
}

const Balances: React.FC = () => {

  const sushi = useSushi()

  const shareBalance = useTokenBalance(getSushiAddress(sushi))
  const shareTotalSupply = useShareTotalSupply()

  return (
    <StyledWrapper>
      <StyledMod>
        <StyledModHd>Your SHARE Balance</StyledModHd>
        <StyledModBd>
          <Value
            value={getBalanceNumber(shareBalance)}
          />
        </StyledModBd>
        <StyledModFt>
          Pending harvest <PendingRewards /> SHARE
        </StyledModFt>
      </StyledMod>

      <Spacer />

      <StyledMod>
        <StyledModHd>Total SHARE Supply</StyledModHd>
        <StyledModBd>
          <Value
            value={getBalanceNumber(shareTotalSupply)}
            decimals={0}
          />
        </StyledModBd>
        <StyledModFt>
          New rewards per block 3 SHARE 
        </StyledModFt>
      </StyledMod>
    </StyledWrapper>
  )
}

const StyledMod  = styled.div`
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

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: stretch;
  }
`

export default Balances
