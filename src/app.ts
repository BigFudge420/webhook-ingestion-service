import express from 'express'
import router from './routes'
import { errorHandler } from './errorHandler'

const app = express() 

app.use(express.json({
    verify: (req : any, _res, buf) => {
        req.rawBody = buf
    },
}))
app.use('/webhook', router)
app.use(errorHandler)

export default app