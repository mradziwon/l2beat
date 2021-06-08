import { BigNumber } from 'ethers'
import { getTokenBySymbol } from '../tokens'
import { BalanceChecker } from './BalanceChecker'
import { BlockInfo } from './BlockInfo'
import { SimpleDate } from './SimpleDate'

export class TokenBalanceChecker {
  constructor(
    private balanceChecker: BalanceChecker,
    private blockInfo: BlockInfo
  ) {}

  async getBalance(account: string, tokenSymbol: string, date: SimpleDate) {
    const token = getTokenBySymbol(tokenSymbol)
    const block = await this.blockInfo.getMaxBlock(date)
    if (block < token.sinceBlock) {
      return BigNumber.from(0)
    }
    return !token.address
      ? this.balanceChecker.getEthBalance(account, block)
      : this.balanceChecker.getERC20Balance(token.address, account, block)
  }

  async getBalances(account: string, tokenSymbol: string, dates: SimpleDate[]) {
    return Promise.all(
      dates.map(async (date) => {
        const balance = await this.getBalance(account, tokenSymbol, date)
        return { date, balance }
      })
    )
  }
}