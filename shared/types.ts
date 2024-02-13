export enum DOMAIN {
  IGM = 'IGM',
  RETAIL = 'RETAIL',
  LOGISTICS = 'LOGISTICS',
  FINANCE = 'FINANCE',
  MOBILITY = 'MOBILITY',
}

export enum ERROR_MESSAGE {
  LOG_VERIFICATION_UNSUCCESSFUL = 'Logs were not verified successfully',
  LOG_VERIFICATION_SUCCESSFUL = 'Logs were verified successfully',
  LOG_VERIFICATION_INVALID_VERSION = 'Invalid Version! Please enter a valid version',
  LOG_VERIFICATION_INVALID_DOMAIN = 'Invalid Domain! Please enter a valid version',
}

export interface IHttpResponse {
  message?: string
  report: any
  reportTimestamp: string
  bpp_id: string
  bap_id: string
  domain: string
}
