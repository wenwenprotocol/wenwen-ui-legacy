import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'

import metamaskLogo from '../../assets/img/metamask-fox.svg'
import walletConnectLogo from '../../assets/img/wallet-connect.svg'
import onekeyLogo from '../../assets/img/onekey.png'

import Modal, { ModalProps } from '../Modal'
import ModalActions from '../ModalActions'
import ModalContent from '../ModalContent'
import ModalTitle from '../ModalTitle'
import Spacer from '../Spacer'

import WalletCard from './components/WalletCard'
import { useTranslation } from 'react-i18next'

const WalletProviderModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation()

  const { account, connect } = useWallet()

  useEffect(
    () => {
      if (account) {
        onDismiss()
      }
    },
    [account, onDismiss]
  )

  return (
    <Modal>
      <ModalTitle text={t('wallet.select_provider')} />

      <ModalContent>
        <StyledWalletsWrapper>
          <StyledWalletCard>
            <WalletCard
              icon={<img src={metamaskLogo} style={{ height: 32 }} alt="Metamask" />}
              onConnect={() => connect('injected')}
              title="Metamask"
            />
          </StyledWalletCard>
          <Spacer size="sm" />
          <StyledWalletCard>
            <WalletCard
              icon={<img src={walletConnectLogo} style={{ height: 24 }} alt="WalletConnect" />}
              onConnect={() => connect('walletconnect')}
              title="WalletConnect"
            />
          </StyledWalletCard>
          <Spacer size="sm" />
          <StyledWalletCard>
            <WalletCard
              icon={<img src={onekeyLogo} style={{ height: 36 }} alt="OneKey" />}
              onConnect={() => connect('injected')}
              title="OneKey"
            />
          </StyledWalletCard>
        </StyledWalletsWrapper>
      </ModalContent>

      <ModalActions>
        <StyledButton onClick={onDismiss}>{t('cancel')}</StyledButton>
      </ModalActions>
    </Modal>
  )
}

const StyledWalletsWrapper = styled.div``

const StyledWalletCard = styled.div`margin: 10px 0;`

const StyledButton = styled.div`
  border: 1px solid #41a558;
  font-size: 16px;
  color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 48px;
  cursor: pointer;
  margin: 0 24px;

  &:hover {
    background: linear-gradient(95.78deg, #41a558 -0.9%, #44a69b 100%);
  }
`

export default WalletProviderModal
