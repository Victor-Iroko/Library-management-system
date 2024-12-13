import { userRole } from '@prisma/client'
import { addReservation, deleteReservation, editReservation, findManyReservations, finduniqueReservation } from 'controllers/reservation'
import express from 'express'
import { verifyJWT, verifyRoles } from 'middlewares/auth'


const reservationRouter = express.Router()

reservationRouter.use(verifyJWT)

reservationRouter.get('/', verifyRoles([userRole.ADMIN, userRole.LIBRARIAN]), findManyReservations)
reservationRouter.get('/:id', finduniqueReservation)
reservationRouter.post('/', addReservation)
reservationRouter.patch('/:id', editReservation)
reservationRouter.delete('/:id', deleteReservation) // cancel a reservation


export default reservationRouter