import { createContext } from 'react'
import { CashesContext } from './types'

const context = createContext<CashesContext>({
  cashes: [],
})

export default context
