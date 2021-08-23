import React from 'react'
import { formatNumber, NumberFormat } from 'utils/formatNumber'

const RewardsCard = () => {
  return (
    <div className="flex flex-col space-y-2 h-full md:flex-row md:space-y-0 md:space-x-2">
      <div className="flex-auto bg-primary-dark bg-opacity-10 py-6 px-6 rounded-card flex flex-col">
        <div className="flex-auto">
          <div className="text-xs font-extrabold tracking-widest text-black uppercase">Available Rewards</div>
          <div className="text-2xl font-semibold">-</div>
        </div>
        <div className="flex justify-end items-end">
          <a
            href="/vesting"
            className="flex items-center justify-center
        font-bold text-white
        bg-gradient-to-tr from-primary-hover via-primary-gradientVia to-primary-gradientTo
        opacity-50
        cursor-pointer
    w-full
    md:w-1/3
        py-2
        px-6
        rounded"
          >
            {' '}
            Claim{' '}
          </a>
        </div>
      </div>
    </div>
  )
}

export default RewardsCard
