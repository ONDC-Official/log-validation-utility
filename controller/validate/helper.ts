import _ from 'lodash'
import { sign, hash } from '../../shared/crypto'
import { logger } from '../../shared/logger'
import { DOMAIN, ERROR_MESSAGE } from '../../shared/types'
import { IGMvalidateLogs, validateLogs, RSFvalidateLogs, RSFvalidateLogsV2, IGMvalidateLogs2 } from '../../shared/validateLogs'
import { validateLogsForFIS12 } from '../../shared/Actions/FIS12Actions'
import { validateLogsForMobility } from '../../shared/Actions/mobilityActions'
import { validateLogsForMetro } from '../../shared/Actions/metroActions'
import { validateLogsForFIS10 } from '../../shared/Actions/FIS10Actions'
import { validateLogsForFIS13 } from '../../shared/Actions/FIS13Actions'
import { validateLogsForTRV13 } from '../../shared/Actions/TRV13Actions'
import { getFis14Format, validateLogsForFIS14 } from '../../shared/Actions/FIS14Actions'

const createSignature = async ({ message }: { message: string }) => {
  const privateKey = process.env.SIGN_PRIVATE_KEY as string

  if (!privateKey) throw new Error('Private key not initialised')

  const currentDate = new Date().toISOString()
  const hashString = await hash({ message })

  const signingString = `${hashString}|${currentDate}`
  const signature = await sign({ message: signingString, privateKey })
  return { signature, currentDate }
}
const getEnumForDomain = (path: string) => {
  if (path.includes('trv')) return DOMAIN.MOBILITY
  if (path.includes('fis')) return DOMAIN.FINANCE
  if (path.includes('logistics')) return DOMAIN.LOGISTICS
  if (path.includes('validate') || path.includes('retail')) return DOMAIN.RETAIL
  if (path.includes('igm')) return DOMAIN.IGM
  if (path.includes('rsf')) return DOMAIN.RSF
  throw new Error('Domain could not be detected')
}
const validateRetail = async (
  domain: string,
  payload: string,
  version: string,
  flow: string,
  bap_id: string,
  bpp_id: string,
) => {
  let response: any
  let success = false
  let message = ERROR_MESSAGE.LOG_VERIFICATION_UNSUCCESSFUL

  if (!bap_id || !bpp_id || !flow) {
    message = ERROR_MESSAGE.LOG_VERIFICATION_INVALID_PAYLOAD
    return { response, success, message }
  }

  switch (version) {
    case '1.2.0':
      response = await validateLogs(payload, domain, flow)

      if (_.isEmpty(response)) {
        success = true
        message = ERROR_MESSAGE.LOG_VERIFICATION_SUCCESSFUL
      }

      break
    default:
      message = ERROR_MESSAGE.LOG_VERIFICATION_INVALID_VERSION
      logger.warn('Invalid Version!!')
  }

  return { response, success, message }
}
const validateFinance = async (domain: string, payload: string, version: string, flow?: string) => {
  let response
  let success = false
  let message = ERROR_MESSAGE.LOG_VERIFICATION_UNSUCCESSFUL

  if (!flow) throw new Error('Flow not defined')

  switch (domain) {
    case 'ONDC:FIS10':
      response = validateLogsForFIS10(payload, flow, version)

      if (_.isEmpty(response)) {
        success = true
        message = ERROR_MESSAGE.LOG_VERIFICATION_SUCCESSFUL
      }

      break

    case 'ONDC:FIS12':
      response = validateLogsForFIS12(payload, flow, version)

      if (_.isEmpty(response)) {
        success = true
        message = ERROR_MESSAGE.LOG_VERIFICATION_SUCCESSFUL
      }

      break

    case 'ONDC:FIS13':
      response = validateLogsForFIS13(payload, flow, version)

      if (_.isEmpty(response)) {
        success = true
        message = ERROR_MESSAGE.LOG_VERIFICATION_SUCCESSFUL
      }

      break

    case 'ONDC:FIS14':
      console.log('flow hello', flow)
      response = validateLogsForFIS14(payload, flow, version)

      if (_.isEmpty(response)) {
        success = true
        message = ERROR_MESSAGE.LOG_VERIFICATION_SUCCESSFUL
      }

      break
    default:
      message = ERROR_MESSAGE.LOG_VERIFICATION_INVALID_VERSION
      logger.warn('Invalid Version!!')
  }

  return { response, success, message }
}
const validateMobility = async (domain: string, payload: string, version: string, flow?: string) => {
  let response
  let success = false
  let message = ERROR_MESSAGE.LOG_VERIFICATION_UNSUCCESSFUL

  if (!flow) throw new Error('Flow not defined')

  switch (domain) {
    case 'ONDC:TRV10':
      response = validateLogsForMobility(payload, flow, version)

      if (_.isEmpty(response)) {
        success = true
        message = ERROR_MESSAGE.LOG_VERIFICATION_SUCCESSFUL
      }

      break

    case 'ONDC:TRV11':
      response = validateLogsForMetro(payload)

      if (_.isEmpty(response)) {
        success = true
        message = ERROR_MESSAGE.LOG_VERIFICATION_SUCCESSFUL
      }

      break

      case 'ONDC:TRV13':
        response = validateLogsForTRV13(payload, domain, flow)
  
        if (_.isEmpty(response)) {
          success = true
          message = ERROR_MESSAGE.LOG_VERIFICATION_SUCCESSFUL
        }
  
        break
    default:
      message = ERROR_MESSAGE.LOG_VERIFICATION_INVALID_DOMAIN
      logger.warn('Invalid Domain!!')
  }

  return { response, success, message }
}
const validateIGM = async (payload: string, version: string) => {
  let response
  let success = false
  let message = ERROR_MESSAGE.LOG_VERIFICATION_UNSUCCESSFUL

  switch (version) {
    case '1.0.0':
      response = IGMvalidateLogs(payload)

      if (_.isEmpty(response)) {
        success = true
        message = ERROR_MESSAGE.LOG_VERIFICATION_SUCCESSFUL
      }

      break
      case '2.0.0':
      response = IGMvalidateLogs2(payload)

      if (_.isEmpty(response)) {
        success = true
        message = ERROR_MESSAGE.LOG_VERIFICATION_SUCCESSFUL
      }

      break

    default:
      message = ERROR_MESSAGE.LOG_VERIFICATION_INVALID_VERSION
      logger.warn('Invalid Version!!')
  }

 

  return { response, success, message }
}




const validateRSF = async (payload: string, version: string) => {
  logger.info('Entering validateRSF function')
  let response
  let success = false
  let message = ERROR_MESSAGE.LOG_VERIFICATION_UNSUCCESSFUL
  switch (version) {
    case '1.0.0':
      response = RSFvalidateLogs(payload)

      if (_.isEmpty(response)) {
        success = true
        message = ERROR_MESSAGE.LOG_VERIFICATION_SUCCESSFUL
      }
      break;

    case '2.0.0':
      response = RSFvalidateLogsV2(payload)
      logger.info('RSF 2.0.0 validation response:', response)

      if (_.isEmpty(response)) {
        success = true
        message = ERROR_MESSAGE.LOG_VERIFICATION_SUCCESSFUL
      }
      break;

    default:
      message = ERROR_MESSAGE.LOG_VERIFICATION_INVALID_VERSION
      logger.warn('Invalid Version!!')
  }

  return { response, success, message }
}

const getFinanceValidationFormat = (domain: string, version: string) => {
  switch (domain) {
    case 'ONDC:FIS14':
      return getFis14Format(version)
    default:
      throw new Error('Domain not supported yet')
  }
}

export default {
  validateFinance,
  validateIGM,
  validateMobility,
  validateRetail,
  validateRSF,
  getFinanceValidationFormat,
  getEnumForDomain,
  createSignature,
}
