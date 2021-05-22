import { useActiveWeb3React } from 'hooks'
import { useHALORewardsContract } from 'hooks/useContract'
import { useCallback, useMemo } from 'react'
import { useSingleCallResult, useSingleContractMultipleData } from 'state/multicall/hooks'
import { formatEther, parseEther } from 'ethers/lib/utils'
import { useTransactionAdder } from 'state/transactions/hooks'

export const useWhitelistedPoolAddresses = () => {
  const rewardsContract = useHALORewardsContract()
  const data = useSingleCallResult(rewardsContract, 'getWhitelistedAMMPoolAddresses')

  return useMemo<string[]>(() => {
    return data.result ? data.result[0] : []
  }, [data])
}

export const useUnclaimedRewardsPerPool = (poolAddresses: string[]): { [poolAddress: string]: number } => {
  const { account } = useActiveWeb3React()
  const rewardsContract = useHALORewardsContract()

  const args = useMemo(() => poolAddresses.map(address => [address, account ?? '']), [poolAddresses, account])
  const results = useSingleContractMultipleData(rewardsContract, 'getUnclaimedPoolRewardsByUserByPool', args)

  return useMemo(
    () =>
      poolAddresses.length > 0
        ? poolAddresses.reduce<{ [poolAddress: string]: number }>((memo, address, i) => {
            if (!results[i]) return memo

            const unclaimed = results[i].result
            if (unclaimed) {
              memo[address] = parseFloat(formatEther(unclaimed.toString()))
            }
            return memo
          }, {})
        : {},
    [poolAddresses, results]
  )
}

export const useClaimedAndUnclaimedRewardsPerPool = (poolAddresses: string[]): { [poolAddress: string]: number } => {
  const { account } = useActiveWeb3React()
  const rewardsContract = useHALORewardsContract()

  const args = useMemo(() => poolAddresses.map(address => [address, account ?? '']), [poolAddresses, account])
  const results = useSingleContractMultipleData(rewardsContract, 'getClaimedAndUnclaimedPoolRewardsByUserByPool', args)

  return useMemo(
    () =>
      poolAddresses.length > 0
        ? poolAddresses.reduce<{ [poolAddress: string]: number }>((memo, address, i) => {
            if (!results[i]) return memo

            const claimedUnclaimed = results[i].result
            if (claimedUnclaimed) {
              memo[address] = parseFloat(formatEther(claimedUnclaimed.toString()))
            }
            return memo
          }, {})
        : {},
    [poolAddresses, results]
  )
}

export const useStakedBPTPerPool = (poolAddresses: string[]): { [poolAddress: string]: number } => {
  const { account } = useActiveWeb3React()
  const rewardsContract = useHALORewardsContract()

  const args = useMemo(() => poolAddresses.map(address => [address, account ?? '']), [poolAddresses, account])
  const results = useSingleContractMultipleData(rewardsContract, 'getDepositedPoolTokenBalanceByUser', args)

  return useMemo(
    () =>
      poolAddresses.length > 0
        ? poolAddresses.reduce<{ [poolAddress: string]: number }>((memo, address, i) => {
            if (!results[i]) return memo

            const bptStaked = results[i].result
            if (bptStaked) {
              memo[address] = parseFloat(formatEther(bptStaked.toString()))
            }
            return memo
          }, {})
        : {},
    [poolAddresses, results]
  )
}

export const useDepositWithdrawPoolTokensCallback = () => {
  const rewardsContract = useHALORewardsContract()
  const addTransaction = useTransactionAdder()

  const depositPoolTokens = useCallback(
    async (poolTokenAddress: string, amount: number) => {
      if (!rewardsContract) return

      const tx = await rewardsContract.depositPoolTokens(poolTokenAddress, parseEther(`${amount}`).toString())
      addTransaction(tx, {
        summary: `Stake ${amount} BPT`
      })

      return tx
    },
    [rewardsContract, addTransaction]
  )

  const withdrawPoolTokens = useCallback(
    async (poolTokenAddress: string, amount: number) => {
      if (!rewardsContract) return

      const tx = await rewardsContract.withdrawPoolTokens(poolTokenAddress, parseEther(`${amount}`).toString())
      addTransaction(tx, {
        summary: `Unstake ${amount} BPT`
      })

      return tx
    },
    [rewardsContract, addTransaction]
  )

  return [depositPoolTokens, withdrawPoolTokens]
}

export const useClaimRewardsCallback = () => {
  const rewardsContract = useHALORewardsContract()
  const addTransaction = useTransactionAdder()

  const claimRewards = useCallback(
    async (poolTokenAddress: string) => {
      if (!rewardsContract) return

      const tx = await rewardsContract.withdrawUnclaimedPoolRewards(poolTokenAddress)
      addTransaction(tx, {
        summary: `Claim rewards (DSRT)`
      })

      return tx
    },
    [rewardsContract, addTransaction]
  )

  return [claimRewards]
}
