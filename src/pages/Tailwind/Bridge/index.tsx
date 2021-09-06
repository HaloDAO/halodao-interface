import React from 'react'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import BridgePanel from './BridgePanel'
import InfoCard from 'components/Tailwind/Cards/InfoCard'
import PageNotSupported from 'components/Tailwind/Layout/PageNotSupported'
import { NETWORK_SUPPORTED_FEATURES, NETWORK_LABEL } from '../../../constants/networks'
import { ChainId } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'

const NotSupportedContent = () => {
  const { chainId } = useActiveWeb3React()
  const caption = 'Ooops! Sorry this page/feature is not supported in ' + NETWORK_LABEL[chainId as ChainId] + '.'
  return (
    <div className="flex items-center bg-white py-6 px-8 border border-primary-hover shadow-md rounded-card">
      <div className="w-full">
        <PageNotSupported caption={caption} />
      </div>
    </div>
  )
}
const CurrentPanelContent = () => {
  const { chainId } = useActiveWeb3React()
  const features = NETWORK_SUPPORTED_FEATURES[chainId as ChainId]
  let content = <></>
  if (features?.bridge) {
    content = <BridgePanel />
  } else {
    content = <NotSupportedContent />
  }
  return content
}
const Bridge = () => {
  return (
    <PageWrapper className="mb-8">
      <div className="md:float-left md:w-1/2">
        <PageHeaderLeft
          subtitle=""
          title="Bridge"
          caption="Move your ERC-20 token from EVM bridge to EVM bridge."
          link={{ text: 'Learn about bridge', url: 'https://docs.halodao.com' }}
        />
      </div>
      <div className="md:float-right md:w-1/2">
        <CurrentPanelContent />
      </div>
      <div className="hidden md:flex items-start md:w-1/2">
        <InfoCard
          title="Bridge Info"
          description="Use the HaloDAO bridge to move your tokens between any of the supported EVM compatible networks. The bridge takes a fixed fee that accrues to the Rainbow Pool."
        />
      </div>
    </PageWrapper>
  )
}

export default Bridge
