import dotenv from 'dotenv'
dotenv.config()

export const access = process.env.JWT_ACCESS as string
export const refresh = process.env.JWT_REFRESH as string
