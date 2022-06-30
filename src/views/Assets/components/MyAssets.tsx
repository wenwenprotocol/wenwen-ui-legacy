import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'

import Value from '../../../components/Value'
import Button from '../../../components/Button'

import useSushi from '../../../hooks/useSushi'

import { getAccountCashBalance } from "../../../sushi/utils";
import { getSushiAddress } from '../../../sushi/utils'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { bnToDec } from '../../../utils'

import useBlock from '../../../hooks/useBlock'
import useCashes from '../../../hooks/useCashes'
import useTokenBalance from '../../../hooks/useTokenBalance'
interface CalimProps {
  title: string,
}

const Claim: React.FC<CalimProps> = ({ title }) => {
  const sushi = useSushi()
  const { account } = useWallet()

  const block = useBlock()
  const cashes = useCashes()
  const sushiBalance = useTokenBalance(getSushiAddress(sushi))

  const [tokens, setTokens] = useState([{ name: 'USDN', amount: 0 }, { name: 'JPYN', amount: 0 }, { name: 'EURN', amount: 0 }])

  useEffect(() => {
    const fetchVaultClaim = async () => {
      const promises = cashes.map(({ tokenContract, name }) => getAccountCashBalance(tokenContract, account, name))
      const balances = await Promise.all(promises)

      const tokens = balances.map(({ name, balance }: { name: string, balance: BigNumber }) => ({
        name,
        amount: bnToDec(balance)
      }))

      setTokens(tokens)
    }

    if (account) {
      fetchVaultClaim()
    }
  }, [block, sushi, account])

  type Link = {
    [key: string]: string
  }

  const LINK_MAP: Link = {
    USDN: 'https://app.uniswap.org/#/swap?inputCurrency=0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599&outputCurrency=0x4bC831111B480f07b7F74DBE90726f3b11201033&use=V2',
    JPYN: 'https://app.uniswap.org/#/swap?inputCurrency=0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599&outputCurrency=0x95E91a76f225612995043AB26A98E6a4E3e1999b&use=V2',
    EURN: 'https://app.uniswap.org/#/swap?inputCurrency=0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599&outputCurrency=0x96dc9e0fE87EEf0b48f88d6aC541ba4F9992aac6&use=V2',
    SHAREN: 'https://app.uniswap.org/#/swap?inputCurrency=0x4bC831111B480f07b7F74DBE90726f3b11201033&outputCurrency=0x772C316e0A7Ab5f1DE6de5199A22c951254C5CD3&use=V2'
  }

  return (
    <StyledClaim>
      <StyledHd>{title}</StyledHd>
      <StyledBd>
            <StyledCash>
              <Value value={getBalanceNumber(sushiBalance)} />
              <StyledItemText><span><a href={LINK_MAP['SHAREN']} target="_blank" rel="noopener noreferrer">SHAREN</a></span></StyledItemText>
            </StyledCash>
        {tokens.length ?
          tokens.map(({ name, amount }) => (
            <StyledCash key={name}>
              <Value value={amount} />
              <StyledItemText><span><a href={LINK_MAP[name]} target="_blank" rel="noopener noreferrer">{name}</a></span></StyledItemText>
            </StyledCash>
          )) : null
        }
      </StyledBd>
      <StyledFt>
        <Button to="/swap" text="Swap"/>
      </StyledFt>        
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
  font-size: 16px;
  color: #A8B0C1;
`

const StyledBd = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-flow: wrap;
`

const StyledFt = styled.div`
  width: 160px;
  margin-top: 20px;
`

const StyledCash = styled.div`
  margin-bottom: 20px;
  flex-basis: 45%;
`

const StyledItemText = styled.div`
  font-size: 12px;
  color: #A8B0C1;
  margin-top: 10px;

  a {
    color: #A8B0C1;
    margin-right: 5px;
  }

  span {
    margin-right: 5px;
  }
`

export default Claim
