export enum DOMAIN {
  IGM = 'IGM',
  RETAIL = 'RETAIL',
  LOGISTICS = 'LOGISTICS',
  FINANCE = 'FINANCE',
  MOBILITY = 'MOBILITY',
  RSF = 'RSF',
}

export enum ERROR_MESSAGE {
  LOG_VERIFICATION_UNSUCCESSFUL = 'Logs were not verified successfully',
  LOG_VERIFICATION_SUCCESSFUL = 'Logs were verified successfully',
  LOG_VERIFICATION_INVALID_VERSION = 'Invalid Version! Please enter a valid version',
  LOG_VERIFICATION_INVALID_PAYLOAD = 'Invalid Payload! Please enter a valid payload (bap_id, bpp_id, flow should be provided)',
}

export interface IHttpResponse {
  message?: string
  report: any
  reportTimestamp: string
  bpp_id: string
  bap_id: string
  domain: string
}
