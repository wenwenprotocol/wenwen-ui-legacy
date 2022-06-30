import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import useModal from '../../../hooks/useModal'
import Button from '../../Button'
import WalletProviderModal from '../../WalletProviderModal'
import AccountModal from './AccountModal'
import { formatAddress } from '../../../utils'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Icon from '../../Icon'
import Disconnect from '../../icons/Disconnect'
import { getSupportedChainId } from '../../../utils/chain'

interface AccountButtonProps {}

const AccountButton: React.FC<AccountButtonProps> = (props) => {
  const { t } = useTranslation()

  const [onPresentAccountModal] = useModal(<AccountModal />)
  const [onPresentWalletProviderModal] = useModal(
    <WalletProviderModal />,
    'provider',
  )

  const { account, chainId, connect } = useWallet()
  const supportedChainId = getSupportedChainId()
  // console.log('chainId: ', chainId, 'supportedChainId', supportedChainId)

  const handleUnlockClick = useCallback(() => {
    onPresentWalletProviderModal()
  }, [onPresentWalletProviderModal])

  useEffect(() => {
    if (window.ethereum && !account) {
      connect('injected')
    }
    handleWrongNetwork()
  }, [])

  const handleWrongNetwork = () => {
    if (window.ethereum && chainId && chainId !== supportedChainId) {
      window.ethereum
        .request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${Number(supportedChainId).toString(16)}` }],
        })
        .then(() => {
          connect('injected')
        })
        .catch((e: any) => console.error('AccountButton Wrong Network', e))
    }
  }

  return (
    <StyledAccountButton>
      {!chainId || supportedChainId === chainId ? 
        <>
          {!account ? (
            <Button onClick={handleUnlockClick} size="sm" text={t('wallet.unlock')} />
          ) : (
            <Button onClick={onPresentAccountModal} size="sm" text={formatAddress(account)} />
          )}
        </> : 
        <Button onClick={handleWrongNetwork} size="sm" text="Wrong Network" variant="danger">
          <StyledIcon><Icon size={18}><Disconnect /></Icon></StyledIcon>
        </Button>
      }
    </StyledAccountButton>
  )
}

const StyledAccountButton = styled.div``

const StyledIcon = styled.div`
  margin-right: 5px;
`

export default AccountButton
