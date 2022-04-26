import { useTranslation } from 'react-i18next'
import React from 'react'
import useFarmSummary from 'halo-hooks/useFarmSummary'
import { PoolInfo } from 'halo-hooks/usePoolInfo'
import { TokenPrice } from 'halo-hooks/useTokenPrice'
import StakeCard from '../Tailwind/Cards/StakeCard'

interface FarmSummaryProps {
  poolsInfo: PoolInfo[]
  tokenPrice: TokenPrice
}

const FarmSummary = ({ poolsInfo, tokenPrice }: FarmSummaryProps) => {
  const summary = useFarmSummary(poolsInfo, tokenPrice)
  const { t } = useTranslation()

  return (
    <div className="w-full flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 pb-2 justify-end">
      {/* <StakeCard title={t('totalPoolValue')} value="5000.03" /> */}
      <StakeCard title={t('poolSummaryHaloEarned')} value={summary.haloEarned} />
      <StakeCard title={t('poolSummaryStaked')} value={summary.stakedValue} />
      <StakeCard title={t('poolSummaryStakeable')} value={summary.stakeableValue} />
    </div>
  )
}

export default FarmSummary
