import { userRole } from '@prisma/client'
import { createPayments, findManyPayments, findUniquePayments} from 'controllers/payment'
import express from 'express'
import { verifyJWT, verifyRoles } from 'middlewares/auth'


const paymentRouter = express.Router()

paymentRouter.use(verifyJWT)

paymentRouter.get('/', verifyRoles([userRole.ADMIN, userRole.LIBRARIAN]), findManyPayments)
paymentRouter.get('/:id', findUniquePayments)
paymentRouter.post('/', createPayments)

export default paymentRouter