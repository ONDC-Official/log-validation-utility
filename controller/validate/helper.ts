/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import _ from 'lodash'
import { sign, hash } from '../../shared/crypto'
import { logger } from '../../shared/logger'
import { DOMAIN, ERROR_MESSAGE } from '../../shared/types'
import { IGMvalidateLogs, validateLogs } from '../../shared/validateLogs'
import { validateLogsForFIS12 } from '../../shared/Actions/FIS12Actions'
import { validateLogsForMobility } from '../../shared/Actions/mobilityActions'

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
  throw new Error('Domain could not be detected')
}
const validateRetail = async (domain: string, payload: string, version: string) => {
  let response
  let success = false
  let message = ERROR_MESSAGE.LOG_VERIFICATION_UNSUCCESSFUL
  switch (version) {
    case '1.2.0':
      response = await validateLogs(payload, domain)

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

  switch (version) {
    case '2.0.0':
      response = validateLogsForFIS12(payload, domain, flow)

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

  switch (version) {
    case '2.0.0':
      response = validateLogsForMobility(payload, domain, flow)

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
const validateIGM = async (payload: string, version: string) => {
  let response
  let success = false
  let message = ERROR_MESSAGE.LOG_VERIFICATION_UNSUCCESSFUL

  switch (version) {
    case '1.2.0':
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

export default { validateFinance, validateIGM, validateMobility, validateRetail, getEnumForDomain, createSignature }
