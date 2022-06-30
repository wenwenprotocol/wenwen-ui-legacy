import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'

import ModalTitle from '../../../components/ModalTitle'
import ModalContent from '../../../components/ModalContent'
import Modal, { ModalProps } from '../../../components/Modal'

import { Farm } from '../../../contexts/Farms/types'
import {StakedValue} from '../../../hooks/useAllStakedValue'

interface FarmWithStakedValue extends Farm, StakedValue {
  apy: BigNumber
}
interface PoolModalProps extends ModalProps {
  pools: Array<FarmWithStakedValue>,
  onConfirm: (index: number) => void
}

const PoolModal: React.FC<PoolModalProps> = ({
  pools,
  onConfirm,
}) => {
  return (
    <Modal>
      <ModalTitle text="Select a Pool" />

      <ModalContent>
        {
          pools.map((pool, i) => 
            <StyledPool key={i} onClick={() => onConfirm(i)}>
              <Hd>
                <StyledIcon>{ pool.icon }</StyledIcon>
                <StyledName>{ pool.lpToken }</StyledName>
              </Hd>
              <StyledAPY>
                {
                  pool.apy && pool.apy.toNumber() ? 
                  `APY ${pool.apy
                    .times(new BigNumber(100))
                    .toNumber()
                    .toLocaleString('en-US')
                    .slice(0, -1)}%`
                  : 'APY -%'
                }
              </StyledAPY>
            </StyledPool> 
          )
        }
      </ModalContent>
    </Modal>
  )
}

const StyledPool = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px; 0
  margin-bottom: 15px;
  cursor: pointer;
`

const Hd = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const StyledIcon = styled.div``

const StyledName = styled.div`
  font-size: 16px;
  color: #fff;
`

const StyledAPY = styled.div`
  font-size: 14px;
  color: #A8B0C1;
`

export default PoolModal