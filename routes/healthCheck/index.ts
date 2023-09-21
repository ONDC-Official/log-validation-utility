import express from 'express'
import healthController from '../../controller/healthCheck'

const router = express.Router()

router.get('/', healthController.healthCheck)

export default router
