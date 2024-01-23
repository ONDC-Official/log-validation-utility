import express from 'express'
import validateController from '../../controller/validate'

const router = express.Router()

router.post('/validate', validateController.validate)
router.post('/validate/token', validateController.validateToken)
router.post('/validate/fis/fis12', validateController.validate)
router.post('/validate/igm', validateController.validate)
router.post('/validate-schema', validateController.validateAction)
router.post('/validate/trv/trv10', validateController.validate)

export default router
