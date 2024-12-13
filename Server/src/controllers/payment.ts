import { paymentClient } from "config/client"
import { notFoundError } from "errors/not-found"
import { StatusCodes } from "http-status-codes"
import { validateRecordExists } from "utils/validateRecord"
import { validator } from "utils/validator"
import { createPaymentSchema } from "validation/payment"


export const findManyPayments = async (req, res) => {
    const result = await paymentClient.findMany()
    res.status(StatusCodes.OK).json(result)
}


export const findUniquePayments = async (req, res) => {
    if (!(await validateRecordExists(paymentClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await paymentClient.findUnique({where: {id: req.params.id}})
    res.status(StatusCodes.OK).json(result)
}

export const createPayments = async (req, res) => {
    const data = await validator(req.body, createPaymentSchema)
    const result = await paymentClient.create({data: {...data}})
    res.status(StatusCodes.OK).json(result)
}
