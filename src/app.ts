import express from 'express'
import router from './routes'
import { errorHandler } from './errorHandler'

declare global {
    namespace Express {
        interface Request {
            rawBody?: Buffer
        }
    }
}

const app = express() 

app.use(express.json({
    verify: (req, _res, buf) => {
        (req as express.Request).rawBody = buf
    },
}))
app.use('/webhook', router)
app.use(errorHandler)

export default app