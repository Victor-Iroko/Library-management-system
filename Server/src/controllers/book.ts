import { bookClient, booksReadClient, borrowClient, cartClient, reservationClient } from "config/client"
import { notFoundError } from "errors/not-found"
import { StatusCodes } from "http-status-codes"
import { validateRecordExists } from "utils/validateRecord"
import { validator } from "utils/validator"
import { createBookSchema, updateBookSchema } from "validation/book"



export const findManyBooks = async (req, res) => {
    const result = await bookClient.findMany()
    res.status(StatusCodes.OK).json(result)    
}


export const findUniqueBook = async (req, res) => {
    if (!(await validateRecordExists(bookClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await bookClient.findUnique({where: {id: req.params.id}})
    res.status(StatusCodes.OK).json(result)
}

export const addBook = async (req, res) => {
    const data = await validator(req.body, createBookSchema)
    const result = await bookClient.create({data: {...data}})
    res.status(StatusCodes.CREATED).json(result)
}

export const editBookInfo = async (req, res) => {
    if (!(await validateRecordExists(bookClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const data = await validator(req.body, updateBookSchema)
    const result = await bookClient.update({where: {id: req.params.id}, data: {...data}})
    res.status(StatusCodes.OK).json(result)
}

export const deleteBook = async (req, res) => {
    if (!(await validateRecordExists(bookClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await bookClient.delete({where: {id: req.params.id}})
    res.status(StatusCodes.OK).json(result)
}

export const findUserBorrowed = async (req, res) => {
    if (!(await validateRecordExists(bookClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await borrowClient.findMany({where: {book_id: req.params.id}, include: {user: true}})
    res.status(StatusCodes.OK).json(result)
}

export const findUserReservation = async (req, res) => {
    if (!(await validateRecordExists(bookClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await reservationClient.findMany({where: {book_id: req.params.id}, include: {user: true}})
    res.status(StatusCodes.OK).json(result)
}

export const findUserCart = async (req, res) => {
    if (!(await validateRecordExists(bookClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await cartClient.findMany({where: {book_id: req.params.id}, include: {user: true}})
    res.status(StatusCodes.OK).json(result)
}

export const findUserBooksRead = async (req, res) => {
    if (!(await validateRecordExists(bookClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await booksReadClient.findMany({where: {book_id: req.params.id}, include: {user: true}})
    res.status(StatusCodes.OK).json(result)
}

