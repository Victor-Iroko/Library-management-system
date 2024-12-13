import { cartClient } from "config/client"
import { notFoundError } from "errors/not-found"
import { StatusCodes } from "http-status-codes"
import { validateRecordExists } from "utils/validateRecord"
import { validator } from "utils/validator"
import { createCartSchema } from "validation/cart"


export const findAllCart = async (req, res) => {
    const result = await cartClient.findMany()
    res.status(StatusCodes.OK).json(result)
}


export const createCart = async (req, res) => {
    const data = await validator(req.body, createCartSchema)
    const result = await cartClient.create({data: {...data}})
    res.status(StatusCodes.OK).json(result)
}


export const deleteCart = async (req, res) => {
    if (!(await validateRecordExists(cartClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await cartClient.delete({where: {id: req.params.id}})
    res.status(StatusCodes.OK).json(result)
}