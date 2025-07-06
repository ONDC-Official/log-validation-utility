import express, { Application } from 'express'
import healthRoutes from './routes/healthCheck'
import validateRoutes from './routes/validate'
import swaggerUi  from 'swagger-ui-express';
import swaggerDocument  from './swagger_output.json';
import path from 'path';
import cors from 'cors'
const createServer = (): express.Application => {
  const app: Application = express()
 const allowedOrigins = process.env.ALLOWED_ORIGINS

  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true)
        if (allowedOrigins?.indexOf(origin) === -1) {
          const msg = 'The CORS policy for this site does not allow access from the specified Origin.'
          return callback(new Error(msg), false)
        }
        return callback(null, true)
      },
    }),
  )
  // Body parsing Middleware
  app.use(express.json({ limit: '50mb' }))
  app.use(express.static(path.join(__dirname, 'frontend')))

  // For all other routes, serve index.html (React Router support)
  app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'))
  })
  app.use('/health', healthRoutes)
  app.use('/api', validateRoutes)
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  return app
}

export default createServer
