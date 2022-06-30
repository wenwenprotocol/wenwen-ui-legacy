export const addTokenToWallet = async (options: {
  address: string,
  symbol: string,
  decimals: number,
  image?: string,
}): Promise<Boolean> => {
  return window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options,
    },
  })
}