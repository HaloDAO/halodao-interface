import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { consoleLog } from 'utils/simpleLogger'
import { CurveErrorMessage, GeneralErrorMessage, ZapErrorMessage } from '../constants/errors'

export type HaloError = {
  code: number
  data: string
  message: string
}

const useErrorMessage = () => {
  const { t } = useTranslation()
  const [friendlyErrorMessage, setFriendlyErrorMessage] = useState(t('errorMessageCurveDefault'))

  const getFriendlyErrorMessage = useCallback(
    (errorObject: HaloError) => {
      console.log('LowerHalt', errorObject.message.includes(CurveErrorMessage.LowerHalt))
      const errorMap = new Map()
      errorMap.set(CurveErrorMessage.CurveReentered, t('errorMessageCurveDefault'))
      errorMap.set(CurveErrorMessage.AllowanceDecreaseUnderflow, t('errorMessageCurveAllowance'))
      errorMap.set(CurveErrorMessage.ApprovalOverflow, t('errorMessageCurveAllowance'))
      errorMap.set(CurveErrorMessage.InsufficientAllowance, t('errorMessageCurveAllowance'))
      errorMap.set(CurveErrorMessage.Frozen, t('errorMessageCurveFrozen'))
      errorMap.set(CurveErrorMessage.EmergencyState, t('errorMessageCurveEmergency'))
      errorMap.set(CurveErrorMessage.TransactionDeadlinePassed, t('errorMessageCurveDeadlinePassed'))
      errorMap.set(CurveErrorMessage.WhitelistOnGoing, t('errorMessageCurveWhitelistingStage'))
      errorMap.set(CurveErrorMessage.WhitelistStopped, t('errorMessageCurveNotWhitelistingStage'))
      errorMap.set(CurveErrorMessage.SwapAmountTooLarge, t('errorMessageCurveAmountTooLarge'))
      errorMap.set(CurveErrorMessage.SwapConvergenceFailed, t('errorMessageCurveSwapFailed'))
      errorMap.set(CurveErrorMessage.SwapInvariantViolation, t('errorMessageCurveSwapFailed'))
      errorMap.set(CurveErrorMessage.LiquidityInvariantViolation, t('errorMessageCurveSwapFailed'))
      errorMap.set(CurveErrorMessage.UpperHalt, t('errorMessageCurveSwapHalt'))
      errorMap.set(CurveErrorMessage.LowerHalt, t('errorMessageCurveSwapHalt'))
      errorMap.set(CurveErrorMessage.CADCTransferFailed, t('errorMessageCurveERC20TransferFailed'))
      errorMap.set(GeneralErrorMessage.SubtractionOverflow, t('errorMessageSubtractionOverflow'))
      errorMap.set(GeneralErrorMessage.MetamaskRejection, t('errorMessageMetamaskRejection'))
      errorMap.set(ZapErrorMessage.NotEnoughLpAmount, t('error-liquidity-zap-reverted'))
      consoleLog('errorObject', errorObject)
      errorMap.forEach((value, key) => {
        if (errorObject.message.includes(key)) {
          setFriendlyErrorMessage(value)
          console.log(key, value)
        }
      })
      if (typeof errorObject.code !== 'number') {
        setFriendlyErrorMessage(errorObject.message)
      }
    },
    [t]
  )

  return { friendlyErrorMessage, getFriendlyErrorMessage }
}

export default useErrorMessage
