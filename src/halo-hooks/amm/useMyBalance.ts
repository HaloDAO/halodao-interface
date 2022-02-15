import { useEffect, useCallback, useState } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { ERC20_ABI } from '../../constants/abis/erc20'
import { useActiveWeb3React } from '../../hooks'
import { useContract } from '../../sushi-hooks/useContract'
import { useBlockNumber } from '../../state/application/hooks'

export interface MyBalanceProps {
  address: string
  readableOption: boolean
}

export const useMyBalance = (address: string, readableOption?: boolean) => {
  const { account } = useActiveWeb3React()
  const [balance, setBalance] = useState('0')
  const [readable] = useState(readableOption || false)
  const tokenContract = useContract(address, ERC20_ABI, false)
  const blockNumber = useBlockNumber()
  const fetchBalance = async () => {
    const decimals = await tokenContract?.decimals()
    if (readable) {
      setBalance(formatUnits(await tokenContract?.balanceOf(account), decimals))
    } else {
      setBalance(await tokenContract?.balanceOf(account))
    }
  }
  useEffect(() => {
    fetchBalance()
  }, [tokenContract])
  const getUpdatedBalance = useCallback(() => {
    fetchBalance()
  }, [balance, tokenContract, fetchBalance, blockNumber])

  return { balance, getUpdatedBalance }
}
