import { mobilitySequence, TRV14ApiSequence } from './index'

export const driverOnConfirmSequence = [
  mobilitySequence.SEARCH,
  mobilitySequence.ON_SEARCH,
  mobilitySequence.SELECT,
  mobilitySequence.ON_SELECT,
  mobilitySequence.INIT,
  mobilitySequence.ON_INIT,
  mobilitySequence.CONFIRM,
  mobilitySequence.ON_CONFIRM,
  mobilitySequence.ON_STATUS,
  mobilitySequence.ON_UPDATE,
]

export const driverPostConfirmSequence = [
  mobilitySequence.SEARCH,
  mobilitySequence.ON_SEARCH,
  mobilitySequence.SELECT,
  mobilitySequence.ON_SELECT,
  mobilitySequence.INIT,
  mobilitySequence.ON_INIT,
  mobilitySequence.CONFIRM,
  mobilitySequence.ON_CONFIRM,
  mobilitySequence.ON_UPDATE,
  mobilitySequence.ON_STATUS,
]

export const rideCancellation = [
  mobilitySequence.ON_CONFIRM,
  mobilitySequence.SOFT_CANCEL,
  mobilitySequence.SOFT_ON_CANCEL,
  mobilitySequence.CANCEL,
  mobilitySequence.ON_CANCEL,
]
export const driverRideCancellation = [mobilitySequence.ON_CONFIRM, mobilitySequence.ON_CANCEL]
export const driverNotFound = [mobilitySequence.CONFIRM, mobilitySequence.ON_CONFIRM]
export const driverNotFoundPostConfirm = [
  mobilitySequence.CONFIRM,
  mobilitySequence.ON_CONFIRM,
  mobilitySequence.ON_CANCEL,
]

export const TRV14FLOWS: any = {
  PAGINATION: 'PAGINATION',
  PURCHASE_OF_SINGLE_TICKET_WITH_ADD_ON: 'PURCHASE_OF_SINGLE_TICKET_WITH_ADD_ON',
  PURCHASE_OF_MULTIPLE_TICKET_WITH_ADD_ON: 'PURCHASE_OF_MULTIPLE_TICKET_WITH_ADD_ON',
  PURCHASE_JOURNEY:'PURCHASE_JOURNEY',
  TECHNICAL_CANCELLATION: 'TECHNICAL_CANCELLATION',
  USER_CANCELLATION: 'USER_CANCELLATION',
  PARTIAL_CANCELLATION: 'PARTIAL_CANCELLATION',
  CANCELLATION_REJECTED: 'CANCELLATION_REJECTED',
}

export const purchaseofsingleticketwithaddon=[
  TRV14ApiSequence.SEARCH,
  TRV14ApiSequence.ON_SEARCH,
  TRV14ApiSequence.SELECT_1,
  TRV14ApiSequence.ON_SELECT_1,
  TRV14ApiSequence.INIT,
  TRV14ApiSequence.ON_INIT,
  TRV14ApiSequence.CONFIRM,
  TRV14ApiSequence.ON_CONFIRM,
  TRV14ApiSequence.STATUS,
  TRV14ApiSequence.ON_STATUS,
]

export const purchasewithoutaddon=[
  TRV14ApiSequence.SELECT_1,
  TRV14ApiSequence.ON_SELECT_1,
  TRV14ApiSequence.INIT,
  TRV14ApiSequence.ON_INIT,
  TRV14ApiSequence.CONFIRM,
  TRV14ApiSequence.ON_CONFIRM
]

export const searchAndRegisterforIncrementalPull = [
  TRV14ApiSequence.SEARCH,
  TRV14ApiSequence.ON_SEARCH,
  TRV14ApiSequence.ON_SEARCH_1,
  TRV14ApiSequence.ON_SEARCH_2,
]

export const purchaseJourney = [
  TRV14ApiSequence.SELECT_1,
  TRV14ApiSequence.ON_SELECT_1,
  TRV14ApiSequence.SELECT_1,
  TRV14ApiSequence.ON_SELECT_1,
  TRV14ApiSequence.INIT,
  TRV14ApiSequence.ON_INIT,
  TRV14ApiSequence.CONFIRM,
  TRV14ApiSequence.ON_CONFIRM,
  TRV14ApiSequence.STATUS,
  TRV14ApiSequence.ON_STATUS,
]

export const technicalCancellation = [
  TRV14ApiSequence.ON_CONFIRM,
  TRV14ApiSequence.STATUS,
  TRV14ApiSequence.ON_STATUS,
  TRV14ApiSequence.CANCEL,
  TRV14ApiSequence.ON_CANCEL,
  TRV14ApiSequence.CANCEL_1,
  TRV14ApiSequence.ON_CANCEL_1,
]

export const userCancellation = [
  TRV14ApiSequence.ON_CONFIRM,
  TRV14ApiSequence.CANCEL,
  TRV14ApiSequence.ON_CANCEL,
  TRV14ApiSequence.CANCEL_1,
  TRV14ApiSequence.ON_CANCEL_1,
]

export const partialCancellation = [
  TRV14ApiSequence.UPDATE,
  TRV14ApiSequence.ON_UPDATE,
  TRV14ApiSequence.UPDATE_1,
  TRV14ApiSequence.ON_UPDATE_1,
]

export const cancellationRejected = [TRV14ApiSequence.CANCEL, TRV14ApiSequence.ON_CANCEL]

export const TRV14OptialCalls: { [key: string]: string[] } = {
  technicalCancellation: [TRV14ApiSequence.CANCEL, TRV14ApiSequence.ON_CANCEL],
  PAGINATION: [TRV14ApiSequence.ON_SEARCH_2],
}
