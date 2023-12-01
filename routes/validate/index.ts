import express from 'express'
import validateController from '../../controller/validate'

const router = express.Router()

router.post('/validate', validateController.validate)
router.post('/validate/FIS12', validateController.validateFIS)
router.post('/validate-schema', validateController.validateAction)
router.post('/validate/TRV10', validateController.validateMobility)

export default router
