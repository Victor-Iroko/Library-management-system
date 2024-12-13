import { borrowClient } from "config/client"
import { notFoundError } from "errors/not-found"
import { StatusCodes } from "http-status-codes"
import { validateRecordExists } from "utils/validateRecord"
import { validator } from "utils/validator"
import { createBorrowSchema, updateborrowSchema } from "validation/borrowing"


export const findAllBorrows = async (req, res) => {
    const result = await borrowClient.findMany()
    res.status(StatusCodes.OK).json(result)
}


export const findUniqueBorrow = async (req, res) => {
    if (!(await validateRecordExists(borrowClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await borrowClient.findUnique({where: {id: req.params.id}})
    res.status(StatusCodes.OK).json(result)
}

export const createBorrow = async (req, res) => {
    const data = await validator(req.body, createBorrowSchema)
    const result = await borrowClient.create({data: {...data}})
    res.status(StatusCodes.OK).json(result)
}


export const updateBorrow = async (req, res) => {
    if (!(await validateRecordExists(borrowClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const data = await validator(req.body, updateborrowSchema)
    const result = await borrowClient.update({where: {id: req.params.id}, data: {...data}})
    res.status(StatusCodes.OK).json(result)
}