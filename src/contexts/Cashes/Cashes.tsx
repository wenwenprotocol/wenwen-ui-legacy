import React from 'react'

import useSushi from '../../hooks/useSushi'

import { getCashes } from '../../sushi/utils'

import Context from './context'

const Cashes: React.FC = ({ children }) => {
  const sushi = useSushi()
  const cashes = getCashes(sushi)

  return (
    <Context.Provider
      value={{
        cashes,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default Cashes
