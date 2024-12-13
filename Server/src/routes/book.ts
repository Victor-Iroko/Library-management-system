import { userRole } from '@prisma/client'
import { addBook, deleteBook, editBookInfo, findManyBooks, findUniqueBook, findUserBooksRead, findUserBorrowed, findUserCart, findUserReservation } from 'controllers/book'
import express from 'express'
import { verifyJWT, verifyRoles } from 'middlewares/auth'


const bookRouter = express.Router()

bookRouter.use(verifyJWT)

bookRouter.get('/', findManyBooks)
bookRouter.get('/:id', findUniqueBook)
bookRouter.post('/', verifyRoles([userRole.ADMIN, userRole.LIBRARIAN]), addBook)
bookRouter.patch('/:id', verifyRoles([userRole.ADMIN, userRole.LIBRARIAN]), editBookInfo)
bookRouter.delete('/:id', verifyRoles([userRole.ADMIN]), deleteBook)


bookRouter.get('/:id/borrowed', verifyRoles([userRole.ADMIN, userRole.LIBRARIAN]), findUserBorrowed) // gets all the user's who borrowed a certain book
bookRouter.get('/:id/reservation', verifyRoles([userRole.ADMIN, userRole.LIBRARIAN]), findUserReservation)
bookRouter.get('/:id/cart', verifyRoles([userRole.ADMIN, userRole.LIBRARIAN]), findUserCart)
bookRouter.get('/:id/books-read', verifyRoles([userRole.ADMIN, userRole.LIBRARIAN]), findUserBooksRead) // gets all the people who have read a certain book


export default bookRouter