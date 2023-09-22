import express from 'express'
import validateController from '../../controller/validate'

const router = express.Router()

router.post('/validate', validateController.validate)

export default router
