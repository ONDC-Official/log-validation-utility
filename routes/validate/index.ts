import express from 'express'
import validateController from '../../controller/validate'

const router = express.Router()
router.get("/",validateController.healthCheck)
router.post('/validate', validateController.validate)
router.post('/validate/fis', validateController.validate)
router.post('/validate/igm', validateController.validate)
router.post('/validate/trv', validateController.validate)
router.post('/validate-schema', validateController.validateSingleAction)
router.post('/validate/token', validateController.validateToken)
router.post('/validate/rsf', validateController.validate)

export default router
