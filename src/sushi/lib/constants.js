import BigNumber from 'bignumber.js/bignumber'

import addressMap from './localdev-contracts.json'
import kovanAddressMap from './kovan-contracts.json'
import mainnetAddressMap from './mainnet-contracts.json'

export const SUBTRACT_GAS_LIMIT = 100000

const ONE_MINUTE_IN_SECONDS = new BigNumber(60)
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS.times(60)
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS.times(24)
const ONE_YEAR_IN_SECONDS = ONE_DAY_IN_SECONDS.times(365)
const AVERAGE_BLOCK_TIME = 13 // https://etherscan.io/chart/blocktime

const RESTABLE_UTC_TIME = 12
const REPURCHASE_UTC_TIME = 0

export const INTEGERS = {
  ONE_MINUTE_IN_SECONDS,
  ONE_HOUR_IN_SECONDS,
  ONE_DAY_IN_SECONDS,
  ONE_YEAR_IN_SECONDS,
  AVERAGE_BLOCK_TIME,
  ZERO: new BigNumber(0),
  ONE: new BigNumber(1),
  ONES_31: new BigNumber('4294967295'), // 2**32-1
  ONES_127: new BigNumber('340282366920938463463374607431768211455'), // 2**128-1
  ONES_255: new BigNumber(
    '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  ), // 2**256-1
  INTEREST_RATE_BASE: new BigNumber('1e18'),
  REPURCHASE_UTC_TIME,
  RESTABLE_UTC_TIME,
}

export const tokenImages = {
  USDN: 'https://raw.githubusercontent.com/wenwenprotocol/tokenlist/master/assets/usdn.svg',
  JPYN: 'https://raw.githubusercontent.com/wenwenprotocol/tokenlist/master/assets/jpyn.svg',
  EURN: 'https://raw.githubusercontent.com/wenwenprotocol/tokenlist/master/assets/eurn.svg',
  SHAREN: 'https://raw.githubusercontent.com/wenwenprotocol/tokenlist/master/assets/share.svg',
}

export const contractAddresses = {
  sushi: {
    1: mainnetAddressMap.SHARE,
    3: '0x110756D39DB78Cc257E36799642B539Eeb9e4705',
    4: addressMap.SHARE,
    42: kovanAddressMap.SHARE,
    1337: addressMap.SHARE,
  },
  masterChef: {
    1: mainnetAddressMap.WenBanker,
    3: '0x4a2005EDd94018A22bBCbDfca75E3e39Cd955658',
    4: addressMap.WenBanker,
    42: kovanAddressMap.WenBanker,
    1337: addressMap.WenBanker,
  },
  wbtc: {
    1: mainnetAddressMap.WBTC,
    3: '0x5D2777Ab6CA83b95F8f4CF0b456058230c1a7225',
    4: addressMap.WBTC,
    42: kovanAddressMap.WBTC,
    1337: addressMap.WBTC,
  },
  weth: {
    1: mainnetAddressMap.WETH,
    3: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    4: addressMap.WETH,
    42: kovanAddressMap.WETH,
    1337: addressMap.WETH,
  },
  vault: {
    1: mainnetAddressMap.Vault,
    3: '0x8798249c2e607446efb7ad49ec89dd1865ff4272',
    4: addressMap.Vault,
    42: kovanAddressMap.Vault,
    1337: addressMap.Vault,
  },
  share: {
    1: mainnetAddressMap.SHARE,
    3: '0x8798249c2e607446efb7ad49ec89dd1865ff4272',
    4: addressMap.SHARE,
    42: kovanAddressMap.SHARE,
    1337: addressMap.SHARE,
  },
  btcPriceFeed: {
    1: '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c',
    3: '0xECe365B379E1dD183B20fc5f022230C044d51404',
    4: '0xECe365B379E1dD183B20fc5f022230C044d51404',
    42: '0x6135b13325bfC4B00278B4abC5e20bbce2D6580e',
    1337: '0x6135b13325bfC4B00278B4abC5e20bbce2D6580e',
  },
  wenBankerV2: {
    1: mainnetAddressMap.V2.WenBanker,
    3: '',
    4: '',
    42: kovanAddressMap.V2.WenBanker,
    1337: addressMap.V2.WenBanker,
  }
}

export const cashPools = [
  {
    pid: 0,
    vaultAddresses: {
      1: mainnetAddressMap.Vault,
      3: '0x8798249c2e607446efb7ad49ec89dd1865ff4272',
      4: addressMap.Vault,
      42: kovanAddressMap.Vault,
      1337: addressMap.Vault,
    },
    tokenAddresses: {
      1: mainnetAddressMap.USD,
      3: '0x110756D39DB78Cc257E36799642B539Eeb9e4705',
      4: addressMap.USD,
      42: kovanAddressMap.USD,
      1337: addressMap.USD,
    },
    name: 'USDN',
    symbol: 'USDN',
    tokenSymbol: 'USDN',
    icon: tokenImages.USDN,
  },
  {
    pid: 1,
    vaultAddresses: {
      1: mainnetAddressMap.Vault,
      3: '0x8798249c2e607446efb7ad49ec89dd1865ff4272',
      4: addressMap.Vault,
      42: kovanAddressMap.Vault,
      1337: addressMap.Vault,
    },
    tokenAddresses: {
      1: mainnetAddressMap.JPY,
      3: '0x110756D39DB78Cc257E36799642B539Eeb9e4705',
      4: addressMap.JPY,
      42: kovanAddressMap.JPY,
      1337: addressMap.JPY,
    },
    name: 'JPYN',
    symbol: 'JPYN',
    tokenSymbol: 'JPYN',
    icon: tokenImages.JPYN,
  },
  {
    pid: 2,
    vaultAddresses: {
      1: mainnetAddressMap.Vault,
      3: '0x8798249c2e607446efb7ad49ec89dd1865ff4272',
      4: addressMap.Vault,
      42: kovanAddressMap.Vault,
      1337: addressMap.Vault,
    },
    tokenAddresses: {
      1: mainnetAddressMap.EUR,
      3: '0x110756D39DB78Cc257E36799642B539Eeb9e4705',
      4: addressMap.EUR,
      42: kovanAddressMap.EUR,
      1337: addressMap.EUR,
    },
    name: 'EURN',
    symbol: 'EURN',
    tokenSymbol: 'EURN',
    icon: tokenImages.EURN,
  },
]

export const supportedPools = [
  {
    pid: 0,
    lpAddresses: {
      1: mainnetAddressMap.pairs.USD_SHARE,
      3: '0x2E7C32C448176B1682953b214a79354E2473027A',
      4: addressMap.pairs.USD_SHARE,
      42: kovanAddressMap.pairs.USD_SHARE,
      1337: addressMap.pairs.USD_SHARE,
    },
    inputTokenAddresses: {
      1: mainnetAddressMap.SHARE,
      3: '0x110756D39DB78Cc257E36799642B539Eeb9e4705',
      4: addressMap.SHARE,
      42: kovanAddressMap.SHARE,
      1337: addressMap.SHARE,
    },
    cashTokenAddresses: {
      1: mainnetAddressMap.USD,
      3: '0x110756D39DB78Cc257E36799642B539Eeb9e4705',
      4: addressMap.USD,
      42: kovanAddressMap.USD,
      1337: addressMap.USD,
    },
    name: 'SHARE USDN!',
    symbol: 'SHAREN-USDN LP',
    tokenSymbol: 'USDN',
    icon: '💰',
    uniswap:
      'https://app.uniswap.org/#/add/v2/0x772C316e0A7Ab5f1DE6de5199A22c951254C5CD3/0x4bC831111B480f07b7F74DBE90726f3b11201033',
  },
  {
    pid: 1,
    lpAddresses: {
      1: mainnetAddressMap.pairs.JPY_SHARE,
      3: '0x2E7C32C448176B1682953b214a79354E2473027A',
      4: addressMap.pairs.JPY_SHARE,
      42: kovanAddressMap.pairs.JPY_SHARE,
      1337: addressMap.pairs.JPY_SHARE,
    },
    inputTokenAddresses: {
      1: mainnetAddressMap.SHARE,
      3: '0x110756D39DB78Cc257E36799642B539Eeb9e4705',
      4: addressMap.SHARE,
      42: kovanAddressMap.SHARE,
      1337: addressMap.SHARE,
    },
    cashTokenAddresses: {
      1: mainnetAddressMap.JPY,
      3: '0x110756D39DB78Cc257E36799642B539Eeb9e4705',
      4: addressMap.JPY,
      42: kovanAddressMap.JPY,
      1337: addressMap.JPY,
    },
    name: 'SHARE JPYN!',
    symbol: 'SHAREN-JPYN LP',
    tokenSymbol: 'JPYN',
    icon: '💰',
    uniswap:
      'https://app.uniswap.org/#/add/v2/0x772C316e0A7Ab5f1DE6de5199A22c951254C5CD3/0x95E91a76f225612995043AB26A98E6a4E3e1999b',
  },
  {
    pid: 2,
    lpAddresses: {
      1: mainnetAddressMap.pairs.EUR_SHARE,
      3: '0x2E7C32C448176B1682953b214a79354E2473027A',
      4: addressMap.pairs.EUR_SHARE,
      42: kovanAddressMap.pairs.EUR_SHARE,
      1337: addressMap.pairs.EUR_SHARE,
    },
    inputTokenAddresses: {
      1: mainnetAddressMap.SHARE,
      3: '0x110756D39DB78Cc257E36799642B539Eeb9e4705',
      4: addressMap.SHARE,
      42: kovanAddressMap.SHARE,
      1337: addressMap.SHARE,
    },
    cashTokenAddresses: {
      1: mainnetAddressMap.EUR,
      3: '0x110756D39DB78Cc257E36799642B539Eeb9e4705',
      4: addressMap.EUR,
      42: kovanAddressMap.EUR,
      1337: addressMap.EUR,
    },
    name: 'SHARE EURN!',
    symbol: 'SHAREN-EURN LP',
    tokenSymbol: 'EURN',
    icon: '💰',
    uniswap:
      'https://app.uniswap.org/#/add/v2/0x772C316e0A7Ab5f1DE6de5199A22c951254C5CD3/0x96dc9e0fE87EEf0b48f88d6aC541ba4F9992aac6',
  },
  {
    pid: 3,
    lpAddresses: {
      1: mainnetAddressMap.pairs.USD_WBTC,
      3: '0x2E7C32C448176B1682953b214a79354E2473027A',
      4: addressMap.pairs.USD_WBTC,
      42: kovanAddressMap.pairs.USD_WBTC,
      1337: addressMap.pairs.USD_WBTC,
    },
    inputTokenAddresses: {
      1: mainnetAddressMap.WBTC,
      3: '0x5D2777Ab6CA83b95F8f4CF0b456058230c1a7225',
      4: addressMap.WBTC,
      42: kovanAddressMap.WBTC,
      1337: addressMap.WBTC,
    },
    cashTokenAddresses: {
      1: mainnetAddressMap.USD,
      3: '0x110756D39DB78Cc257E36799642B539Eeb9e4705',
      4: addressMap.USD,
      42: kovanAddressMap.USD,
      1337: addressMap.USD,
    },
    name: 'WBTC USDN!',
    symbol: 'WBTC-USDN LP',
    tokenSymbol: 'WBTC USDN',
    icon: '💰',
    uniswap:
      'https://app.uniswap.org/#/add/v2/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/0x4bC831111B480f07b7F74DBE90726f3b11201033',
  },
  {
    pid: 4,
    lpAddresses: {
      1: mainnetAddressMap.pairs.JPY_WBTC,
      3: '0x2E7C32C448176B1682953b214a79354E2473027A',
      4: addressMap.pairs.JPY_WBTC,
      42: kovanAddressMap.pairs.JPY_WBTC,
      1337: addressMap.pairs.JPY_WBTC,
    },
    inputTokenAddresses: {
      1: mainnetAddressMap.WBTC,
      3: '0x5D2777Ab6CA83b95F8f4CF0b456058230c1a7225',
      4: addressMap.WBTC,
      42: kovanAddressMap.WBTC,
      1337: addressMap.WBTC,
    },
    cashTokenAddresses: {
      1: mainnetAddressMap.JPY,
      3: '0x110756D39DB78Cc257E36799642B539Eeb9e4705',
      4: addressMap.JPY,
      42: kovanAddressMap.JPY,
      1337: addressMap.JPY,
    },
    name: 'WBTC JPYN!',
    symbol: 'WBTC-JPYN LP',
    tokenSymbol: 'WBTC JPYN',
    icon: '💰',
    uniswap:
      'https://app.uniswap.org/#/add/v2/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/0x95E91a76f225612995043AB26A98E6a4E3e1999b',
  },
  {
    pid: 5,
    lpAddresses: {
      1: mainnetAddressMap.pairs.EUR_WBTC,
      3: '0x2E7C32C448176B1682953b214a79354E2473027A',
      4: addressMap.pairs.EUR_WBTC,
      42: kovanAddressMap.pairs.EUR_WBTC,
      1337: addressMap.pairs.EUR_WBTC,
    },
    inputTokenAddresses: {
      1: mainnetAddressMap.WBTC,
      3: '0x5D2777Ab6CA83b95F8f4CF0b456058230c1a7225',
      4: addressMap.WBTC,
      42: kovanAddressMap.WBTC,
      1337: addressMap.WBTC,
    },
    cashTokenAddresses: {
      1: mainnetAddressMap.EUR,
      3: '0x110756D39DB78Cc257E36799642B539Eeb9e4705',
      4: addressMap.EUR,
      42: kovanAddressMap.EUR,
      1337: addressMap.EUR,
    },
    name: 'WBTC EURN!',
    symbol: 'WBTC-EURN LP',
    tokenSymbol: 'WBTC EURN',
    icon: '💰',
    uniswap:
      'https://app.uniswap.org/#/add/v2/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/0x96dc9e0fE87EEf0b48f88d6aC541ba4F9992aac6',
  },
]

export const rewardPools = [
  { pid: 0, tokenSymbol: 'SHAREN' },
  { pid: 1, tokenSymbol: 'USDN' },
  { pid: 2, tokenSymbol: 'JPYN' },
  { pid: 3, tokenSymbol: 'EURN' },
]