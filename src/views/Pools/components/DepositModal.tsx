import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'

import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import ModalContent from '../../../components/ModalContent'
import TokenInput from '../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../utils/formatBalance'
import { useTranslation } from 'react-i18next'

interface DepositModalProps extends ModalProps {
  max: BigNumber
  onConfirm: (amount: string) => void
  tokenName?: string,
  uniswap?: string
}

const DepositModal: React.FC<DepositModalProps> = ({
  max,
  onConfirm,
  onDismiss,
  tokenName = '',
  uniswap
}) => {
  const { t } = useTranslation()

  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <Modal>
      <ModalTitle text={t('farm.deposit_token', { tokenName })} />
      <ModalContent>
        <TokenInput
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          max={fullBalance}
          symbol={tokenName}
          link={uniswap}
        />
        <ModalActions>
          <Button text={t('cancel')} variant="secondary" onClick={onDismiss} />
          <Button
            disabled={pendingTx}
            text={pendingTx ? t('pending') : t('confirm')}
            onClick={async () => {
              setPendingTx(true)
              try {
                await onConfirm(val)
                setPendingTx(false)
                onDismiss()
              }
              catch {
                setPendingTx(false)
              }
            }}
          />
        </ModalActions>
      </ModalContent>
    </Modal>
  )
}


export default DepositModal
