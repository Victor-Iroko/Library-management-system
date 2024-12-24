import { userRole } from '@prisma/client'
import { updateBorrow, borrowBook } from 'controllers/borrow'
import express from 'express'
import { verifyJWT, verifyRoles } from 'middlewares/auth'



const borrowRouter = express.Router()

borrowRouter.use(verifyJWT)


borrowRouter.use(verifyRoles(userRole.LIBRARIAN, userRole.ADMIN))
borrowRouter.post('/', borrowBook) 
borrowRouter.patch('/:id', updateBorrow)




export default borrowRouter