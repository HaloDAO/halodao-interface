import React, { useEffect, useState, useCallback } from 'react'
import ethers from 'ethers'
import { ChainId } from '@sushiswap/sdk'
import { ChainTokenMap, HALO } from '../../../constants'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import ConnectButton from 'components/Tailwind/Buttons/ConnectButton'
import SelectedNetworkPanel from 'components/Tailwind/Panels/SelectedNetworkPanel'
import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import PrimaryButton, { PrimaryButtonState, PrimaryButtonType } from 'components/Tailwind/Buttons/PrimaryButton'
import { NetworkModalMode } from 'components/Tailwind/Modals/NetworkModal'
import RetryButton from 'components/Tailwind/Buttons/RetryButton'
import BridgeTransactionModal from './modals/BridgeTransactionModal'
import ArrowIcon from 'assets/svg/switch-icon.svg'
import { ORIGINAL_TOKEN_CHAIN_ID } from 'constants/bridge'
import { useWalletModalToggle } from 'state/application/hooks'
import { shortenAddress } from 'utils'
import { Lock } from 'react-feather'
import useBridge, { useMinimumAmount } from 'halo-hooks/useBridge'
import { useActiveWeb3React } from 'hooks'
import { NETWORK_SUPPORTED_FEATURES } from '../../../constants/networks'
import { ButtonState, ModalState } from '../../../constants/buttonStates'

const BridgePanel = () => {
  const { account, error, chainId } = useActiveWeb3React()
  const [inputValue, setInputValue] = useState('')
  const [approveState, setApproveState] = useState(ApproveButtonState.NotApproved)
  const [showModal, setShowModal] = useState(false)
  const [buttonState, setButtonState] = useState(ButtonState.EnterAmount)
  const [modalState, setModalState] = useState(ModalState.NotConfirmed)

  const [chainToken, setChainToken] = useState<ChainTokenMap>(HALO)
  const [token, setToken] = useState(chainId ? HALO[chainId] : undefined)
  const features = NETWORK_SUPPORTED_FEATURES[chainId as ChainId]

  const {
    onTokenChange,
    onChainIdChange,
    onDestinationChainIdChange,
    estimateDeposit,
    estimateBurnWrappedToken,
    approveAllowance,
    deposit,
    burn,
    allowance,
    destinationChainId,
    setDestinationChainId,
    balance,
    estimatedGas,
    successHash,
    primaryBridgeContract
  } = useBridge({ setButtonState, setApproveState, setInputValue, setChainToken, chainToken, setToken, token })

  const { minimum, getMinimum } = useMinimumAmount(primaryBridgeContract as ethers.Contract)

  useEffect(() => {
    getMinimum()
  }, [primaryBridgeContract, getMinimum])

  const setButtonStates = useCallback(() => {
    if (parseFloat(inputValue) <= 0 || inputValue.trim() === '') {
      setButtonState(ButtonState.EnterAmount)
      setApproveState(ApproveButtonState.NotApproved)
    } else if (Number(inputValue) < minimum) {
      setButtonState(ButtonState.NotMinimum)
      setApproveState(ApproveButtonState.NotApproved)
    } else if (allowance >= parseFloat(inputValue) && parseFloat(inputValue) <= 10000) {
      setButtonState(ButtonState.Next)
      setApproveState(ApproveButtonState.Approved)
    } else if (features?.isBridgeCapped && parseFloat(inputValue) > 10000) {
      setButtonState(ButtonState.MaxCap)
    } else if (parseFloat(inputValue) <= balance && Number(inputValue) > 0 && allowance < parseFloat(inputValue)) {
      setButtonState(ButtonState.Default)
      setApproveState(ApproveButtonState.NotApproved)
    } else if (parseFloat(inputValue) > balance && parseFloat(inputValue) > allowance) {
      setButtonState(ButtonState.InsufficientBalance)
    }
  }, [inputValue, allowance, minimum, balance, features])

  useEffect(() => {
    setButtonStates()
  }, [setButtonStates])

  useEffect(() => {
    onTokenChange()
  }, [onTokenChange])

  useEffect(() => {
    onChainIdChange()
  }, [onChainIdChange])

  useEffect(() => {
    onDestinationChainIdChange()
  }, [onDestinationChainIdChange])

  const NotApproveContent = () => {
    return (
      <div className="mt-4 flex space-x-4">
        <div className="w-1/2">
          <ApproveButton
            title="Approve"
            state={ApproveButtonState.NotApproved}
            onClick={() => approveAllowance(ethers.utils.parseEther(`${inputValue}`))}
          />
        </div>
        <div className="w-1/2">
          <PrimaryButton title="Next" state={PrimaryButtonState.Disabled} />
        </div>
      </div>
    )
  }

  const NextContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title="Next"
          state={PrimaryButtonState.Enabled}
          onClick={() => {
            if (inputValue) {
              setButtonState(ButtonState.Confirming)

              if (token && ORIGINAL_TOKEN_CHAIN_ID[token.address] !== chainId) {
                estimateBurnWrappedToken(inputValue)
              } else {
                estimateDeposit(destinationChainId, inputValue)
              }
              setModalState(ModalState.NotConfirmed)
              setShowModal(true)
            }
          }}
        />
      </div>
    )
  }

  const ApprovingContent = () => {
    return (
      <div className="mt-4 flex space-x-4">
        <div className="w-1/2">
          <ApproveButton title="Approving" state={ApproveButtonState.Approving} />
        </div>
        <div className="w-1/2">
          <PrimaryButton title="Next" state={PrimaryButtonState.Disabled} />
        </div>
      </div>
    )
  }

  const ApprovedContent = () => {
    return (
      <div className="mt-4 flex space-x-4">
        <div className="w-1/2">
          <ApproveButton title="Approve" state={ApproveButtonState.Approved} />
        </div>
        <div className="w-1/2">
          <PrimaryButton title="Next" state={PrimaryButtonState.Disabled} />
        </div>
      </div>
    )
  }

  const ConfirmingContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton type={PrimaryButtonType.Gradient} title="Confirming" state={PrimaryButtonState.InProgress} />
      </div>
    )
  }

  const EnterAmountContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton type={PrimaryButtonType.Gradient} title="Enter an amount" state={PrimaryButtonState.Disabled} />
      </div>
    )
  }

  const InsufficientBalanceContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title="Insufficient Balance"
          state={PrimaryButtonState.Disabled}
        />
      </div>
    )
  }

  const NotMinimumContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title={`Minimum amount 20 ${token?.symbol}`}
          state={PrimaryButtonState.Disabled}
        />
      </div>
    )
  }

  const MaxCapContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title="Maximum amount reached"
          state={PrimaryButtonState.Disabled}
        />
      </div>
    )
  }

  const BelowMinimumContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title={`Minimum bridge threshold below ${minimum} ${token?.symbol}`}
          state={PrimaryButtonState.Disabled}
        />
      </div>
    )
  }

  const RetryContent = () => {
    return (
      <div className="mt-4">
        <RetryButton
          title="Retry"
          isEnabled={true}
          onClick={() => {
            setButtonStates()
          }}
        />
      </div>
    )
  }

  const CurrentButtonContent = () => {
    let content = <></>
    if (approveState === ApproveButtonState.NotApproved && buttonState === ButtonState.Default) {
      content = <NotApproveContent />
    }
    if (approveState === ApproveButtonState.Approving && buttonState === ButtonState.Default) {
      content = <ApprovingContent />
    }
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.Default) {
      content = <ApprovedContent />
    }
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.Next) {
      content = <NextContent />
    }
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.Confirming) {
      content = <ConfirmingContent />
    }
    if (approveState === ApproveButtonState.NotApproved && buttonState === ButtonState.EnterAmount) {
      content = <EnterAmountContent />
    }
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.Retry) {
      content = <RetryContent />
    }
    if (buttonState === ButtonState.NotMinimum) {
      content = <NotMinimumContent />
    }
    if (buttonState === ButtonState.InsufficientBalance) {
      content = <InsufficientBalanceContent />
    }
    if (buttonState === ButtonState.MaxCap) {
      content = <MaxCapContent />
    }
    if (buttonState === ButtonState.NotMinimum) {
      content = <BelowMinimumContent />
    }
    return content
  }

  const MainContent = () => {
    const toggleWalletModal = useWalletModalToggle()

    if (!account && !error) {
      return (
        <div className="mt-2">
          <ConnectButton title="Connect to Wallet" onClick={() => toggleWalletModal()} />
        </div>
      )
    } else {
      return (
        <>
          <p className="flex flex-row mt-2 font-semibold text-secondary-alternate items-center">
            Destination Address <span className="pr-2" /> <Lock size={16} />
          </p>
          <div className="mt-2">
            <p className="rounded-md p-2 w-full bg-primary-lightest"> {account && shortenAddress(account, 12)}</p>
          </div>
          <CurrentButtonContent />
        </>
      )
    }
  }

  return (
    <>
      <div>
        <div className="flex items-start bg-white py-6 px-8 border border-primary-hover shadow-md rounded-card">
          <div className="w-full">
            <div className="flex md:space-x-4 mt-2">
              <div className="mb-2 w-2/5">
                <p className="text-secondary-alternate font-semibold">From</p>
              </div>
              <div className="mb-2 w-1/5"></div>
              <div className="mb-2 w-2/5">
                <p className="text-secondary-alternate font-semibold">To</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <SelectedNetworkPanel
                mode={NetworkModalMode.PrimaryBridge}
                chainId={chainId ?? ChainId.MAINNET}
                onChangeNetwork={() => console.log('hello')}
              />
              <div className="mb-2 w-1/5 flex items-center justify-center">
                <div className="p-2 bg-primary-lighter rounded">
                  <img src={ArrowIcon} alt="Switch" />
                </div>
              </div>
              <SelectedNetworkPanel
                mode={NetworkModalMode.SecondaryBridge}
                chainId={destinationChainId}
                onChangeNetwork={(chainId: number) => setDestinationChainId(chainId)}
                tokenAddress={token ? token.address : chainToken[ChainId.MATIC]?.address}
              />
            </div>

            <p className="mt-2 font-semibold text-secondary-alternate">Amount</p>

            <div className="mt-2">
              <CurrencyInput
                currency={token ?? HALO[ChainId.MAINNET]!} // eslint-disable-line
                value={inputValue}
                canSelectToken={true}
                didChangeValue={val => setInputValue(val)}
                showBalance={true}
                showMax={true}
                onSelectToken={selectedToken => {
                  if (chainId) {
                    setChainToken({ [chainId]: selectedToken })
                  }
                }}
                balance={String(balance)}
              />
            </div>
            <MainContent />
          </div>
        </div>
      </div>

      <BridgeTransactionModal
        isVisible={showModal}
        currency={token ?? HALO[ChainId.MAINNET]!} // eslint-disable-line
        amount={inputValue}
        account={account}
        confirmLogic={async () => {
          if (token && ORIGINAL_TOKEN_CHAIN_ID[token.address] !== chainId) {
            if (await burn(ethers.utils.parseEther(`${inputValue}`))) {
              setModalState(ModalState.Successful)
              setButtonStates()
            } else {
              setShowModal(false)
              setModalState(ModalState.NotConfirmed)
              setButtonState(ButtonState.Retry)
            }
          } else {
            if (await deposit(ethers.utils.parseEther(`${inputValue}`), destinationChainId)) {
              setModalState(ModalState.Successful)
              setButtonStates()
            } else {
              setShowModal(false)
              setModalState(ModalState.NotConfirmed)
              setButtonState(ButtonState.Retry)
            }
          }
        }}
        onDismiss={() => {
          setShowModal(false)
          if (modalState === ModalState.NotConfirmed) setButtonState(ButtonState.Retry)
        }}
        onSuccessConfirm={() => setShowModal(false)}
        originChainId={chainId ?? ChainId.MAINNET}
        destinationChainId={destinationChainId}
        tokenSymbol={token ? token.symbol ?? '' : ''}
        wrappedTokenSymbol={chainToken[destinationChainId] ? chainToken[destinationChainId]?.symbol ?? '' : ''}
        state={modalState}
        setState={setModalState}
        successHash={successHash}
        estimatedGas={estimatedGas}
        primaryBridgeContract={primaryBridgeContract}
      />
    </>
  )
}

export default BridgePanel
