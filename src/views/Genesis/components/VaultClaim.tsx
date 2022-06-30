import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'

import Button from '../../../components/Button'
import Value from '../../../components/Value'

import useSushi from '../../../hooks/useSushi'

import { getVaultContract, claimVault, getVaultToClaim } from '../../../sushi/utils'
import { bnToDec } from '../../../utils'

import useBlock from '../../../hooks/useBlock'
interface CalimProps {
  title: string,
}

const Claim: React.FC<CalimProps> = ({ title }) => {
  const sushi = useSushi()
  const { account } = useWallet()

  const vaultContract = getVaultContract(sushi)
  const block = useBlock()

  const [claims, setClaims] = useState([{ name: 'SHARE', amountToClaim: 0 }, { name: 'USDN', amountToClaim: 0 }, { name: 'JPYN', amountToClaim: 0 }, { name: 'EURN', amountToClaim: 0 }])

  useEffect(() => {
    const fetchVaultClaim = async () => {
      const res = await getVaultToClaim(vaultContract, account)

      const claims = res.map(({ name, amount }: { name: string, amount: BigNumber }) => ({
        name,
        amountToClaim: bnToDec(amount)
      }))

      setClaims(claims)
    }

    if (account && vaultContract) {
      fetchVaultClaim()
    }
  }, [block, sushi, account, vaultContract])


  const total = claims.reduce((acc, cur) => acc += cur.amountToClaim, 0)

  const handleClaimAll = useCallback(async () => claimVault(vaultContract, account), [account, vaultContract])

  return (
    <StyledClaim>
      <StyledHd>{title}</StyledHd>
      <StyledBd>
        {claims.length ?
          claims.map(({ name, amountToClaim }) => (
            <StyledCash key={name}>
              <Value value={amountToClaim} />
              <StyledItemText>{name}</StyledItemText>
            </StyledCash>
          )) : null
        }
      </StyledBd>
      <StyledFt>
        <Button disabled={total === 0} onClick={handleClaimAll} text="Claim" />
      </StyledFt>
    </StyledClaim>
  )
}

const StyledClaim = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border: 1px solid rgba(168, 176, 193, 0.1);
  padding: 30px;
`

const StyledHd = styled.div`
  font-size: 12px;
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
  margin-top: 40px;
`

const StyledCash = styled.div`
  margin-bottom: 20px;
  flex-basis: 45%;
`

const StyledItemText = styled.div`
  font-size: 12px;
  color: #A8B0C1;
  margin-top: 10px;
`

export default Claim
