import React from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'

import Button from '../../components/Button'
import Page from '../../components/Page'

import WalletProviderModal from '../../components/WalletProviderModal'

import useModal from '../../hooks/useModal'

import VaultClaim from './components/MyAssets'

const Assets: React.FC = () => {
  const { account } = useWallet()
  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)

  return (
    <Page>
      {!!account ? (
        <StyledMod>
          <StyledFt>
            <StyledClaim>
              <VaultClaim title="The WENWEN coins you own" />
            </StyledClaim>
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

const StyledFt = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 50px;
`

const StyledClaim = styled.div`
  flex-basis: 45%;
`

export default Assets
