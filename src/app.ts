import express from 'express'
import router from './routes'

const app = express() 

app.use(express.json({
    verify: (req : any, _res, buf) => {
        req.rawBody = buf
    },
}))
app.use('/webhook', router)

export default app