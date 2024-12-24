import { userRole } from '@prisma/client'
import { deleteUser, getAllUsers, getBooksRead, getBorrowHistory, getCart, getModelRecommendations, getNotifications, getProfile, getReservations, markNotificationRead, payFines, updateProfile, verifyPayment } from 'controllers/user'
import express from 'express'
import { verifyJWT, verifyRoles } from 'middlewares/auth'


const userRouter = express.Router()

userRouter.use(verifyJWT)

userRouter.get('/:id/books-read', getBooksRead) 
userRouter.get('/:id/model-recommendations', getModelRecommendations) 
userRouter.get('/:id', getProfile) 
userRouter.patch('/:id', updateProfile) 
userRouter.get('/:id/notifications', getNotifications) 
userRouter.patch('/notifications/:id', markNotificationRead) 
userRouter.get('/:id/borrow', getBorrowHistory)  
userRouter.post('/:id/pay-fines', payFines) 
userRouter.post('/verify-payment/:reference', verifyPayment)
userRouter.get('/:id/cart', getCart) 
userRouter.get('/:id/reservations', getReservations) 
userRouter.delete('/:id', deleteUser)

userRouter.use(verifyRoles(userRole.LIBRARIAN, userRole.ADMIN))
userRouter.get('/', getAllUsers)




export default userRouter