import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

const PORT = process.env.PORT ?? 3000

const morganType =
  process.env.NODE_ENV === 'production' ? ':date[iso] :remote-addr :method :url :status :response-time ms - :res[content-length]' : 'dev'

export default function start() {
  const server = express()
    .use(cors())
    .use(helmet())
    .use(morgan(morganType))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use('/health', (req: Request, res: Response) => res.sendStatus(200))

  server.listen(PORT, () => console.info(`Server is running on port ${PORT}`))
}
