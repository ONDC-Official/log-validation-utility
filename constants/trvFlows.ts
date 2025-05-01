export const Trv14sequence ={
    SEARCH: 'search',
  ON_SEARCH: 'on_search',
  ON_SEARCH1: 'on_search1',
  ON_SEARCH2: 'on_search2',
  SELECT: 'select',
  ON_SELECT: 'on_select',
  SELECT1: 'select1',
  ON_SELECT1: 'on_select1',
  INIT: 'init',
  ON_INIT: 'on_init',
  CONFIRM: 'confirm',
  ON_CONFIRM: 'on_confirm',
  CANCEL: 'cancel',
  ON_CANCEL: 'on_cancel',
  CANCEL1: 'cancel1',
  ON_CANCEL1: 'on_cancel1',
  STATUS1: 'status1',
  STATUS: 'status',
  ON_STATUS: 'on_status',
  ON_STATUS1: 'on_status1',
  UPDATE: 'update',
  ON_UPDATE: 'on_update',
  UPDATE1: 'update1',
  ON_UPDATE1: 'on_update_1',
  }

export const TRV14FLOWS: any = {
    PAGINATION:'PAGINATION',
    PURCHASE_OF_SINGLE_TICKET_WITH_ADD_ON:'PURCHASE_OF_SINGLE_TICKET_WITH_ADD_ON',
    PURCHASE_OF_MULTIPLE_TICKET_WITH_ADD_ON:'PURCHASE_OF_MULTIPLE_TICKET_WITH_ADD_ON',
    TECHNICAL_CANCELLATION:'TECHNICAL_CANCELLATION',
    USER_CANCELLATION:'USER_CANCELLATION',
    PARTIAL_CANCELLATION:'PARTIAL_CANCELLATION',
    CANCELLATION_REJECTED:'CANCELLATION_REJECTED'
  }

  export const searchAndRegisterforIncrementalPull = [
    Trv14sequence.SEARCH,
    Trv14sequence.ON_SEARCH,
    Trv14sequence.ON_SEARCH1,
    Trv14sequence.ON_SEARCH2,
  ]

  export const purchaseJourney = [
    Trv14sequence.SEARCH,
    Trv14sequence.ON_SEARCH,
    Trv14sequence.SELECT,
    Trv14sequence.ON_SELECT,
    Trv14sequence.SELECT1,
    Trv14sequence.ON_SELECT1,
    Trv14sequence.INIT ,
    Trv14sequence.ON_INIT,
    Trv14sequence.CONFIRM,
    Trv14sequence.ON_CONFIRM,
    Trv14sequence.STATUS,
    Trv14sequence.ON_STATUS,
  ]

  export const technicalCancellation =[
    Trv14sequence.ON_CONFIRM,
    Trv14sequence.STATUS,
    Trv14sequence.ON_STATUS,
    Trv14sequence.CANCEL,
    Trv14sequence.ON_CANCEL,
    Trv14sequence.CANCEL1,
    Trv14sequence.ON_CANCEL1 ,
  ]

  export const userCancellation = [
    Trv14sequence.ON_CONFIRM,
    Trv14sequence.CANCEL,
    Trv14sequence.ON_CANCEL,
    Trv14sequence.CANCEL1,
    Trv14sequence.ON_CANCEL1
]

  export const partialCancellation = [
    Trv14sequence.UPDATE,
    Trv14sequence.ON_UPDATE,
    Trv14sequence.UPDATE1,
    Trv14sequence.ON_UPDATE1
  ]
  
  export const cancellationRejected =[
    Trv14sequence.CANCEL, 
    Trv14sequence.ON_CANCEL,
  ]

