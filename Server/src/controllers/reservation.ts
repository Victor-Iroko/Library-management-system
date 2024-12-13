import { reservationClient } from "config/client"
import { notFoundError } from "errors/not-found"
import { StatusCodes } from "http-status-codes"
import { validateRecordExists } from "utils/validateRecord"
import { validator } from "utils/validator"
import { createReservationSchema, updateReservationSchema } from "validation/reservation"


export const findManyReservations = async (req, res) => {
    const result = await reservationClient.findMany()
    res.status(StatusCodes.OK).json(result)    
}

export const finduniqueReservation = async (req, res) => {
    const result = await reservationClient.findUnique({where: {id: req.params.id}})
    res.status(StatusCodes.OK).json(result)
}

export const addReservation = async (req, res) => {
    const data = await validator(req.body, createReservationSchema)
    const result = await reservationClient.create({data: {...data}})
    res.status(StatusCodes.CREATED).json(result)
}

export const editReservation = async (req, res) => {
    if (!(await validateRecordExists(reservationClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const data = await validator(req.body, updateReservationSchema)
    const result = await reservationClient.update({where: {id: req.params.id}, data: {...data}})
    res.status(StatusCodes.OK).json(result)
}

export const deleteReservation = async (req, res) => {
    if (!(await validateRecordExists(reservationClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await reservationClient.delete({where: {id: req.params.id}})
    res.status(StatusCodes.OK).json(result)
}