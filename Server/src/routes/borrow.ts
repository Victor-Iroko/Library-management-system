import { userRole } from '@prisma/client'
import { createBorrow, findAllBorrows, findUniqueBorrow, updateBorrow } from 'controllers/borrow'
import express from 'express'
import { verifyJWT, verifyRoles } from 'middlewares/auth'


const borrowRouter = express.Router()

borrowRouter.use(verifyJWT)

borrowRouter.get('/', verifyRoles([userRole.ADMIN, userRole.LIBRARIAN]), findAllBorrows)
borrowRouter.get('/:id', findUniqueBorrow)
borrowRouter.post('/', createBorrow) // Borrow a book (user-initiated).
borrowRouter.patch('/:id', verifyRoles([userRole.ADMIN, userRole.LIBRARIAN]), updateBorrow) // Mark a book as returned (Admin/Librarian).




export default borrowRouter