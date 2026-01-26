import dotenv from 'dotenv'
dotenv.config()

const access = process.env.JWT_ACCESS as string
const refresh = process.env.JWT_REFRESH as string

export {
    access,
    refresh
}