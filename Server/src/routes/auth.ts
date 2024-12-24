import { login, logout, refreshToken, register } from 'controllers/auth'
import express from 'express'
import { verifyJWTForRegistration } from 'middlewares/auth'


const authRouter = express.Router()


authRouter.post('/register', verifyJWTForRegistration, register)
authRouter.get('/login', login)
authRouter.get('/refreshToken', refreshToken)
authRouter.get('/logout', logout)


export default authRouter