import express from 'express'
import validateController from '../../controller/validate'

const router = express.Router()

router.post('/validate', validateController.validate)
router.post('/validate/fis12', validateController.validateFIS)
router.post('/validate/igm', validateController.validateIGM)
router.post('/validate-schema', validateController.validateAction)
router.post('/validate/trv10', validateController.validateMobility)

export default router
