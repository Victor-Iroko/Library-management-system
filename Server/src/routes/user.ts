import { userRole } from '@prisma/client'
import { createUser, deleteUser, findManyBorrowedBooks, findManyUserBooksRead, findManyUserCart, findManyUserNotifications, findManyUserPayments, findManyUserReservations, getManyUser, getOneUser, updateUserInfo } from 'controllers/user'
import express from 'express'
import { verifyJWT, verifyRoles } from 'middlewares/auth'

const userRouter = express.Router()

userRouter.use(verifyJWT)

userRouter.get('/', verifyRoles([userRole.ADMIN, userRole.LIBRARIAN]),getManyUser)
userRouter.get('/:id', getOneUser)
userRouter.post('/', createUser)
userRouter.patch('/:id',updateUserInfo)
userRouter.delete('/:id', deleteUser)


userRouter.get('/:id/borrowing', findManyBorrowedBooks) // Retrieve all borrowed books by a user.
userRouter.get('/:id/reservations', findManyUserReservations) // Retrieve all reservations made by a user.
userRouter.get('/:id/cart', findManyUserCart) // Retrieve all cart for a particular user
userRouter.get('/:id/notifications', findManyUserNotifications) // retrieve all notifications for a particular user
userRouter.get('/:id/payments', findManyUserPayments) // retrieve all fines paid by a user
userRouter.post('/:id/pay-fines')
userRouter.get('/:id/books-read', findManyUserBooksRead) // retrieve all the books read by a user

export default userRouter