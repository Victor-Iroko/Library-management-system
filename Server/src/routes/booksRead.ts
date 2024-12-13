import { createBooksRead, deleteBooksRead, findManyBooksRead, updateBooksRead } from 'controllers/booksRead'
import express from 'express'
import { verifyJWT } from 'middlewares/auth'



const booksReadRouter = express.Router()

booksReadRouter.use(verifyJWT)

booksReadRouter.get('/', findManyBooksRead)
booksReadRouter.post('/', createBooksRead) // Mark a book as "read" for a user.
booksReadRouter.patch('/:id', updateBooksRead) // Update the status (e.g., add a rating/review) for a book marked as "read".
booksReadRouter.delete('/:id', deleteBooksRead) // remmove a book from the read list

export default booksReadRouter