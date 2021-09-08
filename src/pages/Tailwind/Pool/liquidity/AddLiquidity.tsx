import React, { useState } from 'react'
import { PoolData } from '../models/PoolData'
import { useTokenBalances } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import SegmentControl from 'components/Tailwind/SegmentControl/SegmentControl'
import MultiSidedLiquidity from './MultiSidedLiquidity'
import SingleSidedLiquidity from './SingleSidedLiquidity'
import AddLiquityModal from './AddLiquityModal'

interface AddLiquidityProps {
  pool: PoolData
}

const AddLiquidity = ({ pool }: AddLiquidityProps) => {
  const [activeSegment, setActiveSegment] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [baseAmount, setBaseAmount] = useState('')
  const [quoteAmount, setQuoteAmount] = useState('')
  const [zapAmount, setZapAmount] = useState('')
  const [zapFromBase, setZapFromBase] = useState(false)
  const [slippage, setSlippage] = useState('')

  const { account } = useActiveWeb3React()
  const tokenBalances = useTokenBalances(account ?? undefined, [pool.token0, pool.token1])
  const balances = [tokenBalances[pool.token0.address], tokenBalances[pool.token1.address]]

  return (
    <div>
      <div className="flex items-center justify-end">
        {activeSegment === 1 && (
          <div className="italic text-xs text-gray-400 hidden mr-2 md:block">Swaps will be carried out for you</div>
        )}
        <SegmentControl
          segments={['Two-sided', 'Single-sided']}
          activeSegment={activeSegment}
          didChangeSegment={i => setActiveSegment(i)}
        />
      </div>

      {activeSegment === 0 ? (
        <MultiSidedLiquidity
          pool={pool}
          balances={balances}
          onBaseAmountChanged={setBaseAmount}
          onQuoteAmountChanged={setQuoteAmount}
          onDeposit={() => setShowModal(true)}
        />
      ) : (
        <SingleSidedLiquidity
          pool={pool}
          balances={balances}
          onZapAmountChanged={setZapAmount}
          onZapFromBaseChanged={setZapFromBase}
          onSlippageChanged={setSlippage}
          onDeposit={() => setShowModal(true)}
        />
      )}

      <AddLiquityModal
        isVisible={showModal}
        onDismiss={() => setShowModal(false)}
        pool={pool}
        baseAmount={baseAmount}
        quoteAmount={quoteAmount}
        zapAmount={zapAmount}
        slippage={slippage}
        isMultisided={activeSegment === 0}
        isZappingFromBase={zapFromBase}
      />
    </div>
  )
}

export default AddLiquidity
