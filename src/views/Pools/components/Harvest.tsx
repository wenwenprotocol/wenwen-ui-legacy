import React, { useState } from 'react'
import styled from 'styled-components'

import Button from '../../../components/Button'
import Value from '../../../components/Value'
import useEarnings from '../../../hooks/useEarnings'
import useReward from '../../../hooks/useReward'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { useTranslation } from 'react-i18next'

interface HarvestProps {
  pid: number
}

const Harvest: React.FC<HarvestProps> = ({ pid }) => {
  const earnings = useEarnings(pid)
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useReward(pid)
  const { t } = useTranslation()

  return (
    <StyledMod>
      <StyledModBd>
        <StyledDesc>{t('farm.earned')}</StyledDesc>
        {/* <StyledBox>
          <StyledIcon></StyledIcon>
          <StyledSpan>SHARE</StyledSpan>
        </StyledBox> */}
        <StyledValue>
          <Value value={getBalanceNumber(earnings)} />
        </StyledValue>
      </StyledModBd>
      <StyledModFt>
        <Button
          disabled={!earnings.toNumber() || pendingTx}
          text={pendingTx ? t('farm.collecting') : t('farm.harvest')}
          onClick={async () => {
            setPendingTx(true)
            try {
              await onReward()
              setPendingTx(false)
            }
            catch {
              setPendingTx(false)
            }
          }}
        />
      </StyledModFt>
    </StyledMod>
  )
}

const StyledMod = styled.div``

const StyledModBd = styled.div``

const StyledDesc = styled.div`
  font-size: 12px;
  line-height: 14px;
  color: #A8B0C1;
  margin-bottom: 10px;
`

const StyledValue = styled.div`
  margin-top: 20px;
`

const StyledModFt = styled.div`
  margin-top: 20px;
`

export default Harvest
