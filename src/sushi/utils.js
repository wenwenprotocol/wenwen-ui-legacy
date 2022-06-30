import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const getMasterChefAddress = (sushi) => {
  return sushi && sushi.masterChefAddress
}
export const getSushiAddress = (sushi) => {
  return sushi && sushi.sushiAddress
}

export const getWbtcAddress = (sushi) => {
  return sushi && sushi.wbtcAddress
}

export const getVaultAddress = (sushi) => {
  return sushi && sushi.vaultAddress
}

export const getWethContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.weth
}

export const getMasterChefContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.masterChef
}

export const getSushiContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.sushi
}

export const getWbtcContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.wbtc
}

export const getVaultContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.vault
}

export const getFarms = (sushi) => {
  return sushi
    ? sushi.contracts.pools.map(
        ({
          pid,
          name,
          symbol,
          icon,
          inputTokenAddress,
          cashTokenAddress,
          tokenSymbol,
          tokenContract,
          lpAddress,
          lpContract,
          uniswap,
        }) => ({
          pid,
          id: symbol,
          name,
          lpToken: symbol,
          lpTokenAddress: lpAddress,
          lpContract,
          inputTokenAddress,
          cashTokenAddress,
          tokenSymbol,
          tokenContract,
          earnToken: 'share',
          earnTokenAddress: sushi.contracts.sushi.options.address,
          icon,
          uniswap,
        }),
      )
    : []
}

export const getCashes = (sushi) => {
  return sushi
    ? sushi.contracts.cashes.map(
        ({
          pid,
          name,
          symbol,
          icon,
          tokenAddress,
          tokenSymbol,
          tokenContract,
          vaultAddress,
          vaultContract,
        }) => ({
          pid,
          id: symbol,
          name,
          tokenAddress,
          tokenSymbol,
          tokenContract,
          icon,
          vaultAddress,
          vaultContract,
        }),
      )
    : []
}

export const getRewardPools = (sushi) => {
  return sushi ? sushi.contracts.rewardPools : []
}

export const getPoolWeight = async (masterChefContract, pid) => {
  const { allocPoint } = await masterChefContract.methods.poolInfo(pid).call()
  const totalAllocPoint = await masterChefContract.methods
    .totalAllocPoint()
    .call()
  return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint))
}

export const getEarned = async (masterChefContract, pid, account) => {
  let earned = 0
  try {
    earned = await masterChefContract.methods.pendingShare(pid, account).call()
  }
  catch (e) {
    console.error('getEarned', e)
  }
  return earned
}

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const approveWbtc = async (wbtcContract, vaultContract, account) => {
  return wbtcContract.methods
    .approve(vaultContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const approveAddress = async (lpContract, address, account) => {
  return lpContract.methods
    .approve(address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const getSushiSupply = async (sushi) => {
  return new BigNumber(await sushi.contracts.sushi.methods.totalSupply().call())
}

export const stake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      // console.log(tx)
      return tx.transactionHash
    })
}

export const deposit = async (vaultContract, amount, account, token = '') => {
  const decimals = token === 'WBTC' ? 8 : 18
  return vaultContract.methods
    .deposit(
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      // console.log(tx)
      return tx.transactionHash
    })
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      // console.log(tx)
      return tx.transactionHash
    })
}

export const harvest = async (masterChefContract, pid, account) => {
  return masterChefContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      // console.log(tx)
      return tx.transactionHash
    })
}

export const getStaked = async (poolContract, pid, account) => {
  try {
    const { amount } = await poolContract.methods
      .userInfo(pid, account)
      .call()
    return new BigNumber(amount)
  } catch (e) {
    return new BigNumber(0)
  }
}

export const redeem = async (masterChefContract, account) => {
  let now = new Date().getTime() / 1000
  if (now >= 1597172400) {
    return masterChefContract.methods
      .exit()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        // console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert('pool not active')
  }
}

export const enter = async (contract, amount, account) => {
  debugger
  return contract.methods
    .enter(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      // console.log(tx)
      return tx.transactionHash
    })
}

export const leave = async (contract, amount, account) => {
  return contract.methods
    .leave(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      // console.log(tx)
      return tx.transactionHash
    })
}

export const getSushiPrice = async (sushi) => {
  const price = await sushi.contracts.sushi.methods.getPrice().call()

  return new BigNumber(price)
}

export const getVaultTotalFunded = async (vaultContract) => {
  const total = await vaultContract.methods.totalFunded().call()

  return new BigNumber(total)
}

export const getRatio = async (vaultContract, account) => {
  const ratio = await vaultContract.methods.sharesRateOf(account).call()

  return ratio
}

export const getVaultBalance = async (vaultContract, account) => {
  const balance = await vaultContract.methods.balanceOf(account).call()

  return balance
}

export const getCashPrice = async (cashContract) => {
  const price = await cashContract.methods.getPrice().call()
  const targetPrice = await cashContract.methods.targetPrice().call()

  return {
    price: new BigNumber(price),
    targetPrice: new BigNumber(targetPrice),
  }
}

export const getCashTotalSupply = async (cashContract) => {
  const totalSupply = await cashContract.methods.totalSupply().call()

  return {
    totalSupply: new BigNumber(totalSupply),
  }
}

export const getCashToClaim = async (cashContract) => {
  const { isCurrency: isCash, amount } = await cashContract.methods
    .claimOf()
    .call()

  return { isCash, amount: new BigNumber(amount) }
}

export const getVaultToClaim = async (vaultContract, account) => {
  const amounts = await vaultContract.methods.claimOf(account).call()
  const tokens = ['SHARE', 'USDN', 'JPYN', 'EURN']

  return amounts.map((amount, i) => ({
    name: tokens[i],
    amount: new BigNumber(amount),
  }))
}

// claim 奖励给用户的 cash
export const claimAll = async (vaultContract, account) => {
  const res = await vaultContract.methods
    .claimAll()
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })

  return res
}

export const getTokenTotalSupply = async (tokenContract) => {
  const totalSupply = await tokenContract.methods.totalSupply().call()

  return new BigNumber(totalSupply)
}

// claim 根据存入 wbtc 分配的 cash
export const claimVault = async (vaultContract, account) => {
  const res = await vaultContract.methods
    .claimCrowd()
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })

  return res
}

export const getPEBlockInterval = async (vaultContract) => {
  const startBlock = await vaultContract.methods.start().call()
  const endBlock = await vaultContract.methods.end().call()

  return { startBlock, endBlock }
}

export const getVaultOwnedShare = async (shareContract, vaultAddress) => {
  const amount = await shareContract.methods.balanceOf(vaultAddress).call()

  return new BigNumber(amount)
}

export const getVaultCashBalance = async (cashContract, vaultAddress, cash) => {
  const balance = await cashContract.methods.balanceOf(vaultAddress).call()

  return { cash, balance: new BigNumber(balance) }
}

export const getAccountCashBalance = async (cashContract, account, cash) => {
  const balance = await cashContract.methods.balanceOf(account).call()

  return { name: cash, balance: new BigNumber(balance) }
}

export const getCashTargetPrice = async (cashContract) => {
  const price = await cashContract.methods.targetPrice().call()

  return new BigNumber(price)
}

export const getPoolStakedValue = async (
  masterChefContract,
  lpContract, 
  tokenContract,
  pid,
) => {

  // Get lp token amount in pool
  const lpTokenAmount = await getBalance(lpContract, masterChefContract.options.address)
  // Get lp token total supply
  const lpTotalSupply = await lpContract.methods.totalSupply().call()
  // Calculate ratio
  const ratio = lpTokenAmount.div(new BigNumber(lpTotalSupply))

  const tokenAmount = await getBalance(tokenContract, lpContract.options.address)
  const tokenDecimals = await getTokenDecimals(tokenContract)

  // Get token price in USD
  const cashPrice = await getCashPrice(tokenContract)
  const tokenPrice = cashPrice.price.div(new BigNumber(10).pow(12))

  // Calculate pool value
  const poolValue = tokenPrice.times(tokenAmount.div(new BigNumber(10).pow(tokenDecimals))).times(ratio).times(2)
  let poolWeight = new BigNumber(0)
  try {
    poolWeight = await getPoolWeight(masterChefContract, pid)
  }
  catch (e) {
    console.error('getPoolWeight', e)
  }
  
  return {
    tokenPrice,
    tokenAmount,
    poolValue,
    poolWeight,
  }
}

export const getBtcPrice = async (sushi) => {
  const roundData = await sushi.contracts.btcPriceFeed.methods.latestRoundData().call()
  return new BigNumber(roundData.answer)
}

export const getWenBankerV2Contract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.wenBankerV2
}

export const getPendingReward = async (poolContract, pid, account) => {
  const reward = await poolContract.methods.pendingReward(pid, account).call()
  return new BigNumber(reward)
}

export const getPendingRewardWithPids = async (poolContract, pids, tos) => {
  return await poolContract.methods.pendingRewardWithPids(pids, tos).call()
}

export const claimReward = async (poolContract, pid, account) => {
  return poolContract.methods
    .harvest(pid, account)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      // console.log(tx)
      return tx.transactionHash
    })
}

export const claimRewardWithPids = async (poolContract, pids, tos, account) => {
  return poolContract.methods
    .harvestWithPids(pids, tos)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      // console.log(tx)
      return tx.transactionHash
    })
}

export const getBalance = async (tokenContract, account) => {
  const balance = await tokenContract.methods.balanceOf(account).call()
  return new BigNumber(balance)
}

export const getTokenDecimals = async (tokenContract) => {
  const decimals = await tokenContract.methods.decimals().call()
  return parseInt(decimals)
}

export const getPastEvents = async (contract, eventName, options) => {
  return contract.getPastEvents(eventName, options)
}

export const stakeToken = async (poolContract, pid, amount, to, account) => {
  return poolContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
      to,
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      // console.log(tx)
      return tx.transactionHash
    })
}

export const unstakeToken = async (poolContract, pid, amount, to, account) => {
  return poolContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
      to,
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      // console.log(tx)
      return tx.transactionHash
    })
}

export const getShareRewardByBlock = async (poolContract, fromBlock, toBlock) => {
  const multiplier = await poolContract.methods.getMultiplier(fromBlock, toBlock).call()
  const sharePerBlock = await poolContract.methods.sharePerBlock.call().call()
  // console.log('getShareRewardByBlock', toBlock - fromBlock, multiplier, new BigNumber(sharePerBlock).dividedBy(new BigNumber(10).pow(18)).toString())
  return new BigNumber(sharePerBlock).times(new BigNumber(multiplier)).dividedBy(new BigNumber(10).pow(18))
}

export const getBlockNumber = async (sushi) => {
  const block = await sushi.web3.eth.getBlockNumber()
  return block
}