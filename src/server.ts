import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

const PORT = process.env.PORT ?? 3000
const CORS = process.env.CORS ?? '["http://localhost:3000"]'
const CSP = process.env.CSP ?? '["http://localhost:3000"]'

const morganType =
  process.env.NODE_ENV === 'production' ? ':date[iso] :remote-addr :method :url :status :response-time ms - :res[content-length]' : 'dev'

export default function start() {
  const server = express()
    .set('trust proxy', true)
    .use(cors({ origin: CORS, credentials: true }))
    .use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: CSP,
            styleSrc: ["'self'", "'unsafe-inline'"],
            frameAncestors: CSP,
          },
        },
        frameguard: false,
        hsts: {
          maxAge: 63072000,
          includeSubDomains: true,
          preload: true,
        },
      })
    )
    .use(morgan(morganType))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(bodyParser.json({ type: 'application/csp-report' }))
    .use('/health', (req: Request, res: Response) => res.sendStatus(200))

  server.listen(PORT, () => console.info(`Server is running on port ${PORT}`))
}
