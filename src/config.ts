import dotenv from 'dotenv'

dotenv.config()

interface Config {
    port : number,
    nodeEnv : string,
    webhookSecret : string 
}

const config : Config = {
    port : Number(process.env.PORT || 3000),
    nodeEnv : process.env.NODE_ENV || 'development',
    webhookSecret : process.env.WEBHOOK_SECRET || (() => {
        throw new Error("WEBHOOK_SECRET is not set")
    })()
}

export default config