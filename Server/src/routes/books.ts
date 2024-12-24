import { userRole } from '@prisma/client'
import { addBook, addISBN, addToBooksRead, addToCart, cancelReservations, deleteBook, editBookInfo, getBooks, getBooksDetails, getIdFromISBN, getUsersWhoBorrowed, getUsersWhoReserved, removeFromCart, removeISBN, reserveBook, reviewBook } from 'controllers/book'
import { updateBorrow } from "controllers/borrow"
import express from 'express'
import { verifyJWT, verifyRoles } from 'middlewares/auth'


const booksRouter = express.Router()

booksRouter.use(verifyJWT)

booksRouter.get('/', getBooks) 
booksRouter.get('/:id', getBooksDetails) 
booksRouter.post('/cart', addToCart) 
booksRouter.delete('/cart/:id', removeFromCart) 
booksRouter.post('/reserve', reserveBook) 
booksRouter.delete('/reserve/:id', cancelReservations)
booksRouter.post('/add-to-booksRead', addToBooksRead)
booksRouter.patch('/review-book/:id', reviewBook)
booksRouter.get('/isbn/:id', getIdFromISBN) // get book id based from isbn

booksRouter.use(verifyRoles(userRole.ADMIN, userRole.LIBRARIAN))
booksRouter.post('/', addBook)
booksRouter.patch('/:id', editBookInfo)
booksRouter.delete('/:id', deleteBook)
booksRouter.get('/:id/borrowed', getUsersWhoBorrowed)
booksRouter.get('/:id/reservation', getUsersWhoReserved) // get user reservation
booksRouter.post('/isbn', addISBN) // add isbn
booksRouter.delete('/isbn/:id', removeISBN) // remove isbn






export default booksRouter