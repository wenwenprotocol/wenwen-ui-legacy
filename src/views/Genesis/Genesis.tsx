import React, { useEffect, useCallback, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import BigNumber from 'bignumber.js'

import Stake from "./components/Stake";
import Value from '../../components/Value'
import useSushi from '../../hooks/useSushi'
import useBlock from '../../hooks/useBlock'
import useVaultWbtcBalance from '../../hooks/useVaultWbtcBalance'

import { getVaultContract, getVaultTotalFunded, getVaultBalance, getRatio, getPEBlockInterval } from "../../sushi/utils";
import { getDisplayBalance } from '../../utils/formatBalance'

import Button from '../../components/Button'
import Page from '../../components/Page'

import WalletProviderModal from '../../components/WalletProviderModal'

import useModal from '../../hooks/useModal'

import Claim from './components/Claim'
import VaultClaim from './components/VaultClaim'

import Countdown from './components/Countdown'

const Genesis: React.FC = () => {
  const { account } = useWallet()

  const [ratio, setRatio] = useState(0)
  const [balance, setBalance] = useState(0)
  const [peStatus, setPEStatus] = useState('')

  const sushi = useSushi()

  const block = useBlock()

  const vaultContract = getVaultContract(sushi)

  const vaultWbtcBalance = useVaultWbtcBalance()

  const fetchUserVaultBalance = useCallback(async () => {
    const balance = await getVaultBalance(vaultContract, account)

    setBalance(balance)
  }, [account, vaultContract])

  const fetchUserVaultRatio = useCallback(async () => {
    const ratio = await getRatio(vaultContract, account)

    setRatio(ratio)
  }, [account, vaultContract])

  const fetchPEStatus = useCallback(async () => {
    const { startBlock, endBlock } = await getPEBlockInterval(vaultContract)

    let status: string

    if (block < startBlock) {
      status = 'Preparing'
    } else if (block >= startBlock && block < endBlock) {
      status = 'Ongoing'
    } else if (block >= endBlock) {
      status = 'Completed'
    }

    setPEStatus(status)
  }, [block, vaultContract])

  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)

  useEffect(() => {
    if (account && vaultContract) {
      fetchUserVaultBalance()
      fetchUserVaultRatio()
      fetchPEStatus()
    }
  })

  return (
    <Page>
      {!!account ? (
        <StyledMod>
          <StyledBd>
            {/* <StyledCountdown>
              {peStatus ? <StyledProcess>{peStatus}</StyledProcess> : null}
              <Countdown deadline="Thu Jun 15 2021 12:00:00 GMT+0800" />
            </StyledCountdown> */}

            <StyledItems>
              <StyledItem>
                <StyledItemHd>Vault Total Funded</StyledItemHd>
                <StyledItemBd>
                  <StyledItemNumber>
                    <Value value={getDisplayBalance(vaultWbtcBalance, 8)} />
                  </StyledItemNumber>
                  <StyledItemText>WBTC</StyledItemText>
                </StyledItemBd>
              </StyledItem>

              {/* <StyledItem>
                <StyledItemHd>Your Investment</StyledItemHd>
                <StyledItemBd>
                  <StyledItemNumber>
                    <Value value={getDisplayBalance(new BigNumber(balance), 8)} />
                  </StyledItemNumber>
                  <StyledItemText>WBTC</StyledItemText>
                </StyledItemBd>
                {peStatus === 'Ongoing' ?
                  <StyledItemFt>
                    <Stake vaultContract={vaultContract} vaultBalance={new BigNumber(balance)} />
                  </StyledItemFt>
                  : null} 
              </StyledItem>*/}
            </StyledItems>
          </StyledBd>
          <StyledFt>
            <StyledClaim>
              <VaultClaim title="Returned WENWEN Cashes On Investment" />
            </StyledClaim>

            {/* <StyledClaim>
              <Claim title="Rewarded WENWEN Cashes As Shareholder" />
            </StyledClaim> */}
          </StyledFt>
        </StyledMod>
      ) : (
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Button
            onClick={onPresentWalletProviderModal}
            text="Unlock Wallet"
          />
        </div>

      )}
    </Page>
  )
}

const StyledMod = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-height: calc(100vh - 237px);
`

const StyledBd = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200px;
  margin-bottom: 30px;
`

const StyledFt = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 50px;
`

const StyledCountdown = styled.div`
  margin-right: 50px;
  width: 385px;
`

const StyledProcess = styled.div`
  display: inline-block;
  padding: 10px 15px;
  box-sizing: border-box;
  font-weight: 500;
  font-size: 14px;
  color: #fff;
  background: linear-gradient(95.78deg, #41A558 -0.9%, #44A69B 100%);
  text-align: center;
  line-height: 22px;
  margin-bottom: 40px;
`

const StyledItems = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-basis: 40%;
  flex-grow: 1;
`

const StyledItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
`

const StyledItemHd = styled.div`
  font-size: 12px;
  color: #A8B0C1;
  margin-bottom: 50px;
`

const StyledItemBd = styled.div``

const StyledItemFt = styled.div`
  margin-top: 15px;
`

const StyledItemNumber = styled.div`
  font-size: 36px;
  color: #fff;
`

const StyledItemText = styled.div`
  margin-top: 20px;
  font-size: 12px;
  color: #A8B0C1;
`

const StyledClaim = styled.div`
  flex-basis: 45%;
`

export default Genesis
