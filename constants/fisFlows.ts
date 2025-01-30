import { FIS13HealthSequence } from './index'

export const healthSequence = [
  FIS13HealthSequence.SEARCH_1,
  FIS13HealthSequence.ON_SEARCH_1,
  FIS13HealthSequence.SEARCH_2,
  FIS13HealthSequence.ON_SEARCH_2,
  FIS13HealthSequence.SELECT,
  FIS13HealthSequence.ON_SELECT,
  FIS13HealthSequence.INIT_1,
  FIS13HealthSequence.ON_INIT_1,
  FIS13HealthSequence.INIT_2,
  FIS13HealthSequence.ON_INIT_2,
  FIS13HealthSequence.CONFIRM,
  FIS13HealthSequence.ON_CONFIRM,
]

export const marineSequence = [
  FIS13HealthSequence.SEARCH_1,
  FIS13HealthSequence.ON_SEARCH_1,
  FIS13HealthSequence.SELECT_1,
  FIS13HealthSequence.ON_SELECT_1,
  FIS13HealthSequence.SELECT_2,
  FIS13HealthSequence.ON_SELECT_2,
  FIS13HealthSequence.INIT,
  FIS13HealthSequence.ON_INIT,
  FIS13HealthSequence.CONFIRM,
  FIS13HealthSequence.ON_CONFIRM,
]

export const motorSequence = [
  FIS13HealthSequence.SEARCH_1,
  FIS13HealthSequence.ON_SEARCH_1,
  FIS13HealthSequence.SEARCH_2,
  FIS13HealthSequence.ON_SEARCH_2,
  FIS13HealthSequence.SELECT_1,
  FIS13HealthSequence.ON_SELECT_1,
  FIS13HealthSequence.SELECT_2,
  FIS13HealthSequence.ON_SELECT_2,
  FIS13HealthSequence.SELECT_3,
  FIS13HealthSequence.ON_SELECT_3,
  FIS13HealthSequence.INIT_1,
  FIS13HealthSequence.ON_INIT_1,
  FIS13HealthSequence.INIT_2,
  FIS13HealthSequence.ON_INIT_2,
  FIS13HealthSequence.CONFIRM,
  FIS13HealthSequence.ON_CONFIRM,
]

export const renewSequence = [
  FIS13HealthSequence.ON_CONFIRM,
  FIS13HealthSequence.ON_UPDATE_1,
  FIS13HealthSequence.ON_STATUS,
  FIS13HealthSequence.ON_UPDATE_2,
]

export const claimSequence = [
  FIS13HealthSequence.ON_CONFIRM,
  FIS13HealthSequence.ON_UPDATE_1,
  FIS13HealthSequence.ON_UPDATE_2,
  FIS13HealthSequence.ON_STATUS,
  FIS13HealthSequence.ON_UPDATE_3,
]

export const cancelSequence = [
  FIS13HealthSequence.ON_CONFIRM,
  FIS13HealthSequence.CANCEL,
  FIS13HealthSequence.ON_CANCEL,
  FIS13HealthSequence.ON_UPDATE,
]
