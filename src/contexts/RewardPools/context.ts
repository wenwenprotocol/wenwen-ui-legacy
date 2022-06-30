import { createContext } from 'react'
import { RewardContext } from './types'

const context = createContext<RewardContext>({
  pools: [],
})

export default context
