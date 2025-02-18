import {  TRV14ApiSequence } from "../../constants"
import _ from "lodash"
import { dropDB } from "../../shared/dao"
import { logger } from "../../shared/logger"
import { checkConfirm } from "../../utils/TRV/TRV-14/confirm"
import { checkInit } from "../../utils/TRV/TRV-14/init"
import { checkOnConfirm } from "../../utils/TRV/TRV-14/onConfirm"
import { checkOnInit } from "../../utils/TRV/TRV-14/onInit"
import {  checkOnSearch1 } from "../../utils/TRV/TRV-14/onSearch1"
import { checkOnSelect1 } from "../../utils/TRV/TRV-14/onSelect1"
import { checkOnStatus } from "../../utils/TRV/TRV-14/onStatus"
import { checkSearch } from "../../utils/TRV/TRV-14/search"
import { checkSelect1 } from "../../utils/TRV/TRV-14/select_1"
import { checkStatus } from "../../utils/TRV/TRV-14/status"
import { checkSelect2 } from "../../utils/TRV/TRV-14/select_2"
import { checkOnSelect2 } from "../../utils/TRV/TRV-14/onSelect2"

import {  checkOnCancel1 } from "../../utils/TRV/TRV-14/onCancel1"
import { checkCancel1 } from "../../utils/TRV/TRV-14/cancel_1"
import { checkCancel2 } from "../../utils/TRV/TRV-14/cancel_2"
import { checkOnCancel2 } from "../../utils/TRV/TRV-14/onCancel2"
import { checkUpdate } from "../../utils/TRV/TRV-14/update"
import { checkOnUpdate } from "../../utils/TRV/TRV-14/onUpdate"
import { checkOnSearch2 } from "../../utils/TRV/TRV-14/onSearch2"

export function validateLogsForTRV14(data: any, _flow: string, version: string) {
    const msgIdSet = new Set()
      let logReport: any = {}
      console.log('The DATA IS: ', data)
      try {
        dropDB()
      } catch (error) {
        logger.error('!!Error while removing LMDB', error)
      }

      console.log('VERSION', version)
      if (!_.isEqual(version, '2.0.0')) {
          logReport = { ...logReport, version: `Invalid version ${version}` }
    }
    try {
        if (data[TRV14ApiSequence.SEARCH]) {
        
          const errors = checkSearch(data[TRV14ApiSequence.SEARCH], msgIdSet, version, TRV14ApiSequence.SEARCH)
          if (!_.isEmpty(errors)) {
            logReport = { ...logReport, [TRV14ApiSequence.SEARCH]: errors }
          }
        }
    
        if (data[TRV14ApiSequence.ON_SEARCH1]) {
          const errors = checkOnSearch1(data[TRV14ApiSequence.ON_SEARCH1], msgIdSet, version)
          if (!_.isEmpty(errors)) {
            logReport = { ...logReport, [TRV14ApiSequence.ON_SEARCH1]: errors }
          }
        }
        if (data[TRV14ApiSequence.ON_SEARCH2]) {
          const errors = checkOnSearch2(data[TRV14ApiSequence.ON_SEARCH2], msgIdSet, version)
          if (!_.isEmpty(errors)) {
            logReport = { ...logReport, [TRV14ApiSequence.ON_SEARCH2]: errors }
          }
        }
    
       
    
        if (data[TRV14ApiSequence.SELECT1]) {
          const errors = checkSelect1(data[TRV14ApiSequence.SELECT1], msgIdSet)
          if (!_.isEmpty(errors)) {
            logReport = { ...logReport, [TRV14ApiSequence.SELECT1]: errors }
          }
        }
    
        if (data[TRV14ApiSequence.ON_SELECT1]) {
          const errors = checkOnSelect1(data[TRV14ApiSequence.ON_SELECT1], msgIdSet, version)
          if (!_.isEmpty(errors)) {
            logReport = { ...logReport, [TRV14ApiSequence.ON_SELECT1]: errors }
          }
        }
        if (data[TRV14ApiSequence.SELECT2]) {
          const errors = checkSelect2(data[TRV14ApiSequence.SELECT2], msgIdSet)
          if (!_.isEmpty(errors)) {
            logReport = { ...logReport, [TRV14ApiSequence.SELECT2]: errors }
          }
        }
    
        if (data[TRV14ApiSequence.ON_SELECT2]) {
          const errors = checkOnSelect2(data[TRV14ApiSequence.ON_SELECT2], msgIdSet, version)
          if (!_.isEmpty(errors)) {
            logReport = { ...logReport, [TRV14ApiSequence.ON_SELECT2]: errors }
          }
        }
    
        if (data[TRV14ApiSequence.INIT]) {
          const errors = checkInit(data[TRV14ApiSequence.INIT], msgIdSet, version)
          if (!_.isEmpty(errors)) {
            logReport = { ...logReport, [TRV14ApiSequence.INIT]: errors }
          }
        }
    
        if (data[TRV14ApiSequence.ON_INIT]) {
          const errors = checkOnInit(data[TRV14ApiSequence.ON_INIT], msgIdSet, version)
          if (!_.isEmpty(errors)) {
            logReport = { ...logReport, [TRV14ApiSequence.ON_INIT]: errors }
          }
        }
    
        if (data[TRV14ApiSequence.CONFIRM]) {
          const errors = checkConfirm(data[TRV14ApiSequence.CONFIRM], msgIdSet, version)
          if (!_.isEmpty(errors)) {
            logReport = { ...logReport, [TRV14ApiSequence.CONFIRM]: errors }
          }
        }
    
        if (data[TRV14ApiSequence.ON_CONFIRM]) {
          const errors = checkOnConfirm(data[TRV14ApiSequence.ON_CONFIRM], msgIdSet, version)
          if (!_.isEmpty(errors)) {
            logReport = { ...logReport, [TRV14ApiSequence.ON_CONFIRM]: errors }
          }
        }
    
      
    
        if (data[TRV14ApiSequence.STATUS]) {
          const errors = checkStatus(data[TRV14ApiSequence.STATUS], msgIdSet)
          if (!_.isEmpty(errors)) {
            logReport = { ...logReport, [TRV14ApiSequence.STATUS]: errors }
          }
        }
    
        if (data[TRV14ApiSequence.ON_STATUS]) {
          const errors = checkOnStatus(data[TRV14ApiSequence.ON_STATUS], msgIdSet, version)
          if (!_.isEmpty(errors)) {
            logReport = { ...logReport, [TRV14ApiSequence.ON_STATUS]: errors }
          }
        }

        if (data[TRV14ApiSequence.SOFT_CANCEL]) {
          const errors = checkCancel1(data[TRV14ApiSequence.SOFT_CANCEL], msgIdSet, version)
          if (!_.isEmpty(errors)) {
            logReport = { ...logReport, [TRV14ApiSequence.SOFT_CANCEL]: errors }
          }
        }
       
        if (data[TRV14ApiSequence.SOFT_ON_CANCEL]) {
          const errors = checkOnCancel1(data[TRV14ApiSequence.SOFT_ON_CANCEL], msgIdSet, version)
          if (!_.isEmpty(errors)) {
            logReport = { ...logReport, [TRV14ApiSequence.SOFT_ON_CANCEL]: errors }
          }
        }
       

        if (data[TRV14ApiSequence.CANCEL]) {
          const errors = checkCancel2(data[TRV14ApiSequence.CANCEL], msgIdSet, version)
          if (!_.isEmpty(errors)) {
            logReport = { ...logReport, [TRV14ApiSequence.CANCEL]: errors }
          }
        }

        if (data[TRV14ApiSequence.ON_CANCEL]) {
          const errors = checkOnCancel2(data[TRV14ApiSequence.ON_CANCEL], msgIdSet, version)
          if (!_.isEmpty(errors)) {
            logReport = { ...logReport, [TRV14ApiSequence.ON_CANCEL]: errors }
          }
        }
        if (data[TRV14ApiSequence.UPDATE]) {
          const errors = checkUpdate(data[TRV14ApiSequence.UPDATE], msgIdSet, version)
          if (!_.isEmpty(errors)) {
            logReport = { ...logReport, [TRV14ApiSequence.UPDATE]: errors }
          }
        }
        if (data[TRV14ApiSequence.ON_UPDATE]) {
          const errors = checkOnUpdate(data[TRV14ApiSequence.ON_UPDATE], msgIdSet, version)
          if (!_.isEmpty(errors)) {
            logReport = { ...logReport, [TRV14ApiSequence.ON_UPDATE]: errors }
          }
        }
        logger.info(logReport, 'Report Generated Successfully!!')
        return logReport
    } catch (error: any) {
        logger.error(error.message)
        return error.message
      }
    
}
