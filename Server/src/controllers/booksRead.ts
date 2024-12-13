import { booksReadClient } from "config/client"
import { notFoundError } from "errors/not-found"
import { StatusCodes } from "http-status-codes"
import { validateRecordExists } from "utils/validateRecord"
import { validator } from "utils/validator"
import { createBooksReadSchema, updateBooksReadSchema } from "validation/books-read"



export const findManyBooksRead = async (req, res) => {
    const result = await booksReadClient.findMany()
    res.status(StatusCodes.OK).json(result)
}


export const createBooksRead = async (req, res) => {
    const data = await validator(req.body, createBooksReadSchema)
    const result = await booksReadClient.create({data: {...data}})
    res.status(StatusCodes.OK).json(result)
}

export const updateBooksRead = async (req, res) => {
    if (!(await validateRecordExists(booksReadClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const data = await validator(req.body, updateBooksReadSchema)
    const result = await booksReadClient.update({where: {id: req.params.id}, data: {...data}})
    res.status(StatusCodes.OK).json(result)
}

export const deleteBooksRead = async (req, res) => {
    if (!(await validateRecordExists(booksReadClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await booksReadClient.delete({where: {id: req.params.id}})
    res.status(StatusCodes.OK).json(result)
}