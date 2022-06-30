import BigNumber from 'bignumber.js/bignumber'

import ERC20Abi from './abi/ERC20.json'
import UNIV2PairAbi from './abi/UniswapV2Pair.json'
import WETHAbi from './abi/WETH.json'

import MasterChefAbi from './abi/WenBanker.json'
import SharenAbi from './abi/ShareToken.json'
import VaultAbi from './abi/Vault.json'
import WenBankerV2Abi from './abi/WenBankerV2.json'

import {
  contractAddresses,
  SUBTRACT_GAS_LIMIT,
  supportedPools,
  cashPools,
  rewardPools,
  tokenImages
} from './constants.js'

import * as Types from './types.js'

// stable coin abi
import CashAbi from './abi/StableCoin.json'

import aggregatorV3InterfaceABI from '../../sushi/lib/abi/AggregatorV3Interface.json'
export class Contracts {
  constructor(provider, networkId, web3, options) {
    this.web3 = web3
    this.defaultConfirmations = options.defaultConfirmations
    this.autoGasMultiplier = options.autoGasMultiplier || 1.5
    this.confirmationType =
      options.confirmationType || Types.ConfirmationType.Confirmed
    this.defaultGas = options.defaultGas
    this.defaultGasPrice = options.defaultGasPrice

    this.weth = new this.web3.eth.Contract(WETHAbi)
    this.wbtc = new this.web3.eth.Contract(ERC20Abi)
    this.sushi = new this.web3.eth.Contract(SharenAbi)
    this.masterChef = new this.web3.eth.Contract(MasterChefAbi)
    this.vault = new this.web3.eth.Contract(VaultAbi)
    this.btcPriceFeed = new this.web3.eth.Contract(aggregatorV3InterfaceABI)
    this.wenBankerV2 = new this.web3.eth.Contract(WenBankerV2Abi)

    this.pools = supportedPools.map((pool) =>
      Object.assign(pool, {
        lpAddress: pool.lpAddresses[networkId],
        inputTokenAddress: pool.inputTokenAddresses[networkId],
        cashTokenAddress: pool.cashTokenAddresses[networkId],
        lpContract: new this.web3.eth.Contract(UNIV2PairAbi),
        tokenContract: new this.web3.eth.Contract(CashAbi)
      })
    )

    this.cashes = cashPools.map((pool) =>
      Object.assign(pool, {
        vaultAddress: pool.vaultAddresses[networkId],
        tokenAddress: pool.tokenAddresses[networkId],
        tokenContract: new this.web3.eth.Contract(CashAbi),
        vaultContract: new this.web3.eth.Contract(VaultAbi)
      })
    )

    this.rewardPools = rewardPools.map((pool) => {
      const cash = cashPools.find(cash => cash.tokenSymbol === pool.tokenSymbol)
      return Object.assign(pool, {
        poolAddress: contractAddresses.wenBankerV2[networkId],
        poolContract: new this.web3.eth.Contract(WenBankerV2Abi),
        tokenAddress: cash ? cash.tokenAddresses[networkId] : contractAddresses.share[networkId],
        tokenContract: cash ? new this.web3.eth.Contract(CashAbi) : new this.web3.eth.Contract(SharenAbi),
        tokenImage: cash ? cash.icon : tokenImages.SHAREN
      })
    })

    this.setProvider(provider, networkId)
    this.setDefaultAccount(this.web3.eth.defaultAccount)
  }

  setProvider(provider, networkId) {
    const setProvider = (contract, address, log) => {
      contract.setProvider(provider)

      if (address) {
        contract.options.address = address
      } else {
        console.error('Contract address not found in network', networkId)
      }
    }

    setProvider(this.weth, contractAddresses.weth[networkId])
    setProvider(this.wbtc, contractAddresses.wbtc[networkId])
    setProvider(this.sushi, contractAddresses.sushi[networkId])
    setProvider(this.masterChef, contractAddresses.masterChef[networkId])
    setProvider(this.vault, contractAddresses.vault[networkId])
    setProvider(this.btcPriceFeed, contractAddresses.btcPriceFeed[networkId])
    setProvider(this.wenBankerV2, contractAddresses.wenBankerV2[networkId])

    this.pools.forEach(
      ({ lpContract, lpAddress, tokenContract, cashTokenAddress }) => {
        setProvider(lpContract, lpAddress, true)
        setProvider(tokenContract, cashTokenAddress, true)
      }
    )

    this.cashes.forEach(
      ({ tokenContract, tokenAddress, vaultAddress, vaultContract }) => {
        setProvider(tokenContract, tokenAddress, true)
        setProvider(vaultContract, vaultAddress, true)
      }
    )

    this.rewardPools.forEach(
      ({ poolAddress, poolContract, tokenAddress, tokenContract }) => {
        setProvider(poolContract, poolAddress, true)
        setProvider(tokenContract, tokenAddress, true)
      }
    )
  }

  setDefaultAccount(account) {
    this.sushi.options.from = account
    this.masterChef.options.from = account
  }

  async callContractFunction(method, options) {
    const {
      confirmations,
      confirmationType,
      autoGasMultiplier,
      ...txOptions
    } = options

    if (!this.blockGasLimit) {
      await this.setGasLimit()
    }

    if (!txOptions.gasPrice && this.defaultGasPrice) {
      txOptions.gasPrice = this.defaultGasPrice
    }

    if (confirmationType === Types.ConfirmationType.Simulate || !options.gas) {
      let gasEstimate
      if (
        this.defaultGas &&
        confirmationType !== Types.ConfirmationType.Simulate
      ) {
        txOptions.gas = this.defaultGas
      } else {
        try {
          console.log('estimating gas')
          gasEstimate = await method.estimateGas(txOptions)
        } catch (error) {
          const data = method.encodeABI()
          const { from, value } = options
          const to = method._parent._address
          error.transactionData = { from, value, data, to }
          throw error
        }

        const multiplier = autoGasMultiplier || this.autoGasMultiplier
        const totalGas = Math.floor(gasEstimate * multiplier)
        txOptions.gas =
          totalGas < this.blockGasLimit ? totalGas : this.blockGasLimit
      }

      if (confirmationType === Types.ConfirmationType.Simulate) {
        let g = txOptions.gas
        return { gasEstimate, g }
      }
    }

    if (txOptions.value) {
      txOptions.value = new BigNumber(txOptions.value).toFixed(0)
    } else {
      txOptions.value = '0'
    }

    const promi = method.send(txOptions)

    const OUTCOMES = {
      INITIAL: 0,
      RESOLVED: 1,
      REJECTED: 2
    }

    let hashOutcome = OUTCOMES.INITIAL
    let confirmationOutcome = OUTCOMES.INITIAL

    const t =
      confirmationType !== undefined ? confirmationType : this.confirmationType

    if (!Object.values(Types.ConfirmationType).includes(t)) {
      throw new Error(`Invalid confirmation type: ${t}`)
    }

    let hashPromise
    let confirmationPromise

    if (
      t === Types.ConfirmationType.Hash ||
      t === Types.ConfirmationType.Both
    ) {
      hashPromise = new Promise((resolve, reject) => {
        promi.on('error', (error) => {
          if (hashOutcome === OUTCOMES.INITIAL) {
            hashOutcome = OUTCOMES.REJECTED
            reject(error)
            const anyPromi = promi
            anyPromi.off()
          }
        })

        promi.on('transactionHash', (txHash) => {
          if (hashOutcome === OUTCOMES.INITIAL) {
            hashOutcome = OUTCOMES.RESOLVED
            resolve(txHash)
            if (t !== Types.ConfirmationType.Both) {
              const anyPromi = promi
              anyPromi.off()
            }
          }
        })
      })
    }

    if (
      t === Types.ConfirmationType.Confirmed ||
      t === Types.ConfirmationType.Both
    ) {
      confirmationPromise = new Promise((resolve, reject) => {
        promi.on('error', (error) => {
          if (
            (t === Types.ConfirmationType.Confirmed ||
              hashOutcome === OUTCOMES.RESOLVED) &&
            confirmationOutcome === OUTCOMES.INITIAL
          ) {
            confirmationOutcome = OUTCOMES.REJECTED
            reject(error)
            const anyPromi = promi
            anyPromi.off()
          }
        })

        const desiredConf = confirmations || this.defaultConfirmations
        if (desiredConf) {
          promi.on('confirmation', (confNumber, receipt) => {
            if (confNumber >= desiredConf) {
              if (confirmationOutcome === OUTCOMES.INITIAL) {
                confirmationOutcome = OUTCOMES.RESOLVED
                resolve(receipt)
                const anyPromi = promi
                anyPromi.off()
              }
            }
          })
        } else {
          promi.on('receipt', (receipt) => {
            confirmationOutcome = OUTCOMES.RESOLVED
            resolve(receipt)
            const anyPromi = promi
            anyPromi.off()
          })
        }
      })
    }

    if (t === Types.ConfirmationType.Hash) {
      const transactionHash = await hashPromise
      if (this.notifier) {
        this.notifier.hash(transactionHash)
      }
      return { transactionHash }
    }

    if (t === Types.ConfirmationType.Confirmed) {
      return confirmationPromise
    }

    const transactionHash = await hashPromise
    if (this.notifier) {
      this.notifier.hash(transactionHash)
    }
    return {
      transactionHash,
      confirmation: confirmationPromise
    }
  }

  async callConstantContractFunction(method, options) {
    const m2 = method
    const { blockNumber, ...txOptions } = options
    return m2.call(txOptions, blockNumber)
  }

  async setGasLimit() {
    const block = await this.web3.eth.getBlock('latest')
    this.blockGasLimit = block.gasLimit - SUBTRACT_GAS_LIMIT
  }
}
