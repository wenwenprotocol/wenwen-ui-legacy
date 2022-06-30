import { useContext } from 'react'
import { Context as CashesContext, Cash } from '../contexts/Cashes'

const useCash = (id: string): Cash => {
  const { cashes } = useContext(CashesContext)
  const cash = cashes.find((cash) => cash.id === id)

  return cash
}

export default useCash
