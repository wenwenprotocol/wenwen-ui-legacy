import { useContext } from 'react'
import { Context as CashesContext } from '../contexts/Cashes'

const useCashes = () => {
  const { cashes } = useContext(CashesContext)
  return cashes
}

export default useCashes
