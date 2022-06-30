import React from 'react'
import styled from 'styled-components'

import StakedToken from './StakedToken'
import { useTranslation } from 'react-i18next'
import useRewardPools from '../../../hooks/useRewardPools'

const StakedTokens: React.FC = () => {
  const { t } = useTranslation()

  const pools = useRewardPools()

  return (
    <StyledClaim>
      <StyledHd>{t('stake.stake')}</StyledHd>
      <StyledBd>
        {pools.length ?
          pools.map(({ tokenSymbol, pid, tokenContract, poolContract }) => (
            <StakedToken 
              key={pid}
              pid={pid}
              tokenSymbol={tokenSymbol}
              poolContract={poolContract}
              tokenContract={tokenContract}
            />
          )) : null
        }
      </StyledBd>
    </StyledClaim>
  )
}

const StyledClaim = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 30px;
`

const StyledHd = styled.div`
  font-size: 18px;
  color: #ffffff;
`

const StyledBd = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-flow: wrap;
`

export default StakedTokens
