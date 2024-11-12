import { logger } from '../../../shared/logger'
import { getValue } from '../../../shared/dao'
import constants, { ApiSequence } from '../../../constants'
import {
    validateSchema,
    isObjectEmpty,
    checkContext,
} from '../..'
import { catalogRejectionErrors, ErrorDetail } from '../../../constants/catalogRejection'
import _ from 'lodash'

interface CatalogError {
    code: string,
    type: string,
    path: string,
    message: string
}

export const checkCatalogRejection = (data: any) => {
    try {
        const errorObj: any = {}
        if (!data || isObjectEmpty(data)) {
            errorObj[ApiSequence.CATALOG_REJECTION] = 'JSON cannot be empty'
            return
        }
        const flow = getValue('flow')
        const { errors, context } = data
        if (!errors || !context || Object.entries(errors).length == 0) {
            return { missingFields: '/context, /errors is missing or empty' }
        }
        const schemaValidation = validateSchema('RET', constants.CATALOG_REJECTION, data)
        const contextRes: any = checkContext(context, constants.CATALOG_REJECTION)

        errors.map((error: CatalogError, index: number) => {
            const errorCode = error?.code
            let catalogError: ErrorDetail | undefined;
            for (const code in catalogRejectionErrors) {
                if (errorCode == code && catalogRejectionErrors.hasOwnProperty(code)) {
                    catalogError = catalogRejectionErrors[code];
                }
            }
            console.log("Hello", catalogError, index)
            if (error.message != catalogError?.message) {
                errorObj[`error.message${index}`] = `Catalog rejection error message doesn't matches with the provided error.message code: ${errorCode}`
            }

            if (error.type != catalogError?.type) {
                errorObj[`error.type${index}`] = `Catalog rejection error message doesn't matches with the provided error.type code: ${errorCode}`
            }
        })

        if (schemaValidation !== 'error') {
            Object.assign(errorObj, schemaValidation)
        }

        if (!contextRes?.valid) {
            Object.assign(errorObj, contextRes.ERRORS)
        }
        if (_.isEqual(data.context, getValue(`domain`))) {
            errorObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
        }

        if (context.city !== '*' && flow == '9') {
            errorObj.contextCityError = 'context/city should be "*" while sending search_inc_catalog request'
        }

        return Object.keys(errorObj).length > 0 && errorObj
    } catch (error: any) {
        logger.error(error.message)
        return { error: error.message }
    }
}
