import { login, logout, refreshToken, register } from 'controllers/auth'
import express from 'express'


const authRouter = express.Router()


authRouter.post('/register', register)
authRouter.get('/login', login)
authRouter.get('/refreshToken', refreshToken)
authRouter.get('/logout', logout)


export default authRouter