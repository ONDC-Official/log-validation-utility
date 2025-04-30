import { mobilitySequence } from './index'

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
