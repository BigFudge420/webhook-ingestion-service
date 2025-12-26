import dotenv from 'dotenv'

dotenv.config()

interface Config {
    port : number,
    node_env : string
}

const config : Config = {
    port : Number(process.env.PORT || 3000),
    node_env : process.env.NODE_ENV || 'development'
}

export default config