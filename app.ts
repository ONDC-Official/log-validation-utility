import express, { Application } from 'express'
import healthRoutes from './routes/healthCheck'

const createServer = (): express.Application => {
  const app: Application = express()

  // Body parsing Middleware
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use('/', healthRoutes)

  return app
}

export default createServer
