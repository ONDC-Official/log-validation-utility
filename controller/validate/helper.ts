import _ from 'lodash'
import { sign, hash } from '../../shared/crypto'
import { logger } from '../../shared/logger'
import { DOMAIN, ERROR_MESSAGE } from '../../shared/types'
import { IGMvalidateLogs} from '../../shared/validateLogs'
import { validateLogsForFIS12 } from '../../shared/Actions/FIS12Actions'
import { validateLogsForMobility } from '../../shared/Actions/mobilityActions'
import { validateLogsForMetro } from '../../shared/Actions/metroActions'
import { validateLogsForFIS10 } from '../../shared/Actions/FIS10Actions'
import { validateLogsForFIS13 } from '../../shared/Actions/FIS13Actions'
import { RSFvalidateLogs } from '../../shared/validateLogs'
import { validateLogs } from '../../shared/validateLogs'
import { RSFvalidateLogs2 } from '../../shared/validateLogs'
import { FLOW } from '../../utils/enum'

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

  if (!bap_id || !bpp_id || !flow || !Object.values(FLOW).includes(flow as FLOW)) {
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
  if (version !== '2.0.0') {
    logger.warn('Invalid Version!!')
    message = ERROR_MESSAGE.LOG_VERIFICATION_INVALID_VERSION
    return { response, success, message }
  }

  switch (domain) {
    case 'ONDC:TRV10':
      response = validateLogsForMobility(payload, domain, flow)

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
    default:
      message = ERROR_MESSAGE.LOG_VERIFICATION_INVALID_VERSION
      logger.warn('Invalid Version!!')
  }

  return { response, success, message }
}
const validateRSF = async (payload: string, version: string) => {
  let response
  let success = false
  let message = ERROR_MESSAGE.LOG_VERIFICATION_UNSUCCESSFUL
  switch (version) {
    case '1.0.0':
    case '2.0.0':
      response = RSFvalidateLogs(payload)

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

const validateRSF2 = async (
  domain: string,
  payload: string,
  _version: string,
  flow: string
) => {
  let response: any;
  let success = false;
  let message = ERROR_MESSAGE.LOG_VERIFICATION_UNSUCCESSFUL;


  if (!flow) {
    message = ERROR_MESSAGE.LOG_VERIFICATION_INVALID_PAYLOAD_RSF;
    return { response, success, message };
  }

  // Validate flow for version 2.0.0
  if (_version === "2.0.0") {
    if (flow !== "expected-flow-for-2.0.0") {
      message = ERROR_MESSAGE.LOG_VERIFICATION_INVALID_VERSION;
      logger.warn("Invalid flow for version 2.0.0!!");
      return { response, success, message };
    }
  }


  response = RSFvalidateLogs2(payload, domain, flow);

  if (_.isEmpty(response)) {
    success = true;
    message = ERROR_MESSAGE.LOG_VERIFICATION_SUCCESSFUL;
  } else {
    message = ERROR_MESSAGE.LOG_VERIFICATION_INVALID_VERSION;
    logger.warn("Invalid Version!!");
  }

  return { response, success, message };
};


export default {
  validateFinance,
  validateIGM,
  validateMobility,
  validateRetail,
  validateRSF,
  validateRSF2,
  getEnumForDomain,
  createSignature,
}
