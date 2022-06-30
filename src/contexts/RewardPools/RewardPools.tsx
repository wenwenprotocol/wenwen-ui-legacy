import React from 'react'

import useSushi from '../../hooks/useSushi'

import { getRewardPools } from '../../sushi/utils'

import Context from './context'

const RewardPools: React.FC = ({ children }) => {

  const sushi = useSushi()
  const pools = getRewardPools(sushi)

  return (
    <Context.Provider
      value={{
        pools,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default RewardPools
