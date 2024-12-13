import { createCart, deleteCart, findAllCart } from 'controllers/cart'
import express from 'express'
import { verifyJWT } from 'middlewares/auth'


const cartRouter = express.Router()

cartRouter.use(verifyJWT)

cartRouter.get('/', findAllCart)

cartRouter.post('/', createCart)

cartRouter.delete('/:id', deleteCart) // Remove a book from the user's cart.


export default cartRouter