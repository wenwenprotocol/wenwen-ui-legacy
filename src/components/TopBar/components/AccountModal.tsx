import React, { useEffect, useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useSushi from '../../../hooks/useSushi'
import { getSushiAddress } from '../../../sushi/utils'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { getAccountCashBalance } from '../../../sushi/utils'
import { bnToDec } from '../../../utils'
import Button from '../../Button'
import Modal, { ModalProps } from '../../Modal'
import ModalActions from '../../ModalActions'
import ModalContent from '../../ModalContent'
import ModalTitle from '../../ModalTitle'
import Spacer from '../../Spacer'
import Value from '../../Value'
import Coins from '../../Coins'

import useCashes from '../../../hooks/useCashes'
import { useTranslation } from 'react-i18next'
import { addTokenToWallet } from '../../../utils/provider'
import { tokenImages } from '../../../sushi/lib/constants'

const AccountModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation()

  const { account, reset } = useWallet()

  const handleSignOutClick = useCallback(() => {
    reset()
    onDismiss!()
  }, [onDismiss, reset])

  const sushi = useSushi()
  const sushiAddress = getSushiAddress(sushi)
  const sushiBalance = useTokenBalance(sushiAddress)

  const cashes = useCashes()
  const [tokens, setTokens] = useState([{ name: 'USDN', amount: 0 }, { name: 'JPYN', amount: 0 }, { name: 'EURN', amount: 0 }])

  useEffect(() => {
    const fetchCashs = async () => {
      const promises = cashes.map(({ tokenContract, name }) => getAccountCashBalance(tokenContract, account, name))
      const balances = await Promise.all(promises)

      const tokens = balances.map(({ name, balance }: { name: string, balance: BigNumber }) => ({
        name,
        amount: bnToDec(balance)
      }))

      setTokens(tokens)
    }

    if (account) {
      fetchCashs()
    }
  }, [sushi, account])

  return (
    <Modal>
      <ModalTitle text={t('wallet.my_account')} />
      <ModalContent>
        <div style={{ display: 'flex' }}>
          <StyledBalanceWrapper>
            <StyledBalanceItem>
              <StyledBalance>
                <StyledText>{`SHAREN ${t('wallet.balance')}`}</StyledText>
                <StyledValue>
                  <Coins coins={['SHAREN']} />
                  <Spacer width="5px"/>
                  <Value value={getBalanceNumber(sushiBalance)} />
                </StyledValue>
              </StyledBalance>
              <StyledAction>
                <Button 
                  onClick={() => addTokenToWallet({
                    address: sushiAddress,
                    symbol: 'SHAREN',
                    decimals: 18,
                    image: tokenImages.SHAREN,
                  })} 
                  size="sm" 
                  text={t('wallet.add_to_wallet')}  
                  variant="secondary" 
                />
              </StyledAction>
            </StyledBalanceItem>
            {tokens.length ?
              tokens.map(({ name, amount }) => (
                <StyledBalanceItem key={name}>
                  <StyledBalance key={name}>
                    <StyledText>{`${name} ${t('wallet.balance')}`}</StyledText>
                    <StyledValue>
                      <Coins coins={[name]} />
                      <Spacer width="5px"/>
                      <Value value={amount} />
                    </StyledValue>
                  </StyledBalance>
                  <StyledAction>
                    <Button 
                      onClick={() => { 
                        const cash = cashes.find(cash => cash.name === name)
                        return addTokenToWallet({
                          address: cash.tokenAddress,
                          symbol: name,
                          decimals: 18,
                          image: cash.icon,
                        })
                      }}
                      size="sm" 
                      text={t('wallet.add_to_wallet')} 
                      variant="secondary" 
                    />
                  </StyledAction>                 
                </StyledBalanceItem>
              )) : null
            }
          </StyledBalanceWrapper>
        </div>

        <Spacer />
        <Button
          href={`https://etherscan.io/address/${account}`}
          text={t('wallet.view')}
        />

      </ModalContent>
      <ModalActions>
        <StyledBtns>
          <StyledButton onClick={onDismiss}>{t('cancel')}</StyledButton>
          <StyledButton onClick={handleSignOutClick}>{t('wallet.sign_out')}</StyledButton>
        </StyledBtns>
      </ModalActions>
    </Modal>
  )
}

const StyledValue = styled.div`
  display: flex;
  align-items: center;
`

const StyledBalanceItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
`

const StyledAction = styled.div`
  flex-basis: 30%;
`

const StyledBalance = styled.div`
  align-items: start;
  display: flex;
  flex-direction: column;
`

const StyledBalanceWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
`

const StyledBtns = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledButton = styled.div`
  flex-basis: 45%;
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
    background: linear-gradient(95.78deg, #41A558 -0.9%, #44A69B 100%);
  }
`

const StyledText = styled.div`
  font-size: 12px;
  color: #A8B0C1;
  line-height: 24px;
`


export default AccountModal
