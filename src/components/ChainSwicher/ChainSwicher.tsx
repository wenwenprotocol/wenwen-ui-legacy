import React from 'react'
import Dropdown from '../Dropdown'
import { DropdownItem } from '../Dropdown/Dropdown'
import { supportedChainIds } from '../../constants/supportedChain'
import styled from 'styled-components'
import Ethereum from '../../assets/img/ethereum.svg'
import Arbitrum from '../../assets/img/arbitrum.svg'

const chainIcon: any = {
  'Ethereum': Ethereum,
  'Kovan': Ethereum,
  'Arbitrum': Arbitrum,
}

const ChainSwicher: React.FC = () => {
  const chains: DropdownItem[] = []
  supportedChainIds.forEach((value, key) => {
    chains.push({ 
      name: value, 
      value: key,
      icon: <Icon src={chainIcon[value]}/>
    })
  })

  const curChainId = parseInt(process.env.REACT_APP_CHAIN_ID) || 1
  const curChain = chains.find(chain => chain.value === curChainId)
  
  return (
    <Dropdown
      width="140px"
      list={chains}
      placeholder={curChain || 'Unknown'}
      onClick={({ name, value }) => window.location.href = `https://${value === 1 ? 'app' : name}.wenwen.money`}
    />
  )
}

const Icon = styled.img`
  height: 20px;
  width: 20px;
`

export default ChainSwicher