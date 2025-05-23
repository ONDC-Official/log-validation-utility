import express, { Application } from 'express'
import healthRoutes from './routes/healthCheck'
import validateRoutes from './routes/validate'
import swaggerUi  from 'swagger-ui-express';
import swaggerDocument  from './swagger_output.json';
import cors from 'cors'; 
const createServer = (): express.Application => {
  const app: Application = express()

  app.use(cors());
  // Body parsing Middleware
  app.use(express.json({ limit: '50mb' }))

  app.use('/', healthRoutes)
  app.use('/api', validateRoutes)
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  return app
}

export default createServer
