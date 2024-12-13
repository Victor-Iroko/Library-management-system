import { booksReadClient, borrowClient, cartClient, notificationClient, paymentClient, reservationClient, userClient } from "config/client";
import { notFoundError } from "errors/not-found";
import { StatusCodes } from "http-status-codes";
import { notFound } from "middlewares/not-found";
import { validateRecordExists } from "utils/validateRecord";
import { validator } from "utils/validator";
import { createUserSchema, updateUserSchema } from "validation/user";


export const createUser = async (req, res) => {
    req.body.role = "USER"
    const data = await validator(req.body, createUserSchema)
    const result = await userClient.create({ data });
    res.status(StatusCodes.CREATED).json(result);
}

export const getManyUser = async (req, res) => {
    // add pagination here
    const user = await userClient.findMany()
    res.status(StatusCodes.OK).json(user)
}

export const getOneUser = async (req, res) => {
    if (!(await validateRecordExists(userClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const user = await userClient.findUnique({where: {id: req.params.id}})
    res.status(StatusCodes.OK).json(user)
}

export const updateUserInfo = async (req, res) => {
    if (!(await validateRecordExists(userClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const data = await validator(req.body, updateUserSchema)
    await userClient.update({where: {id: req.params.id}, data})
    res.status(StatusCodes.OK).json({message: "User information has been updated"})
}


export const deleteUser = async (req, res) => {
    if (!(await validateRecordExists(userClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    await userClient.delete({where: {id: req.params.id}})
    res.status(StatusCodes.OK).json({message: "User has been deleted"})
}

export const findManyBorrowedBooks = async (req, res) => {
    if (!(await validateRecordExists(userClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await borrowClient.findMany({where: {user_id: req.params.id}, include: {book: true}})
    res.status(StatusCodes.OK).json(result)
}


export const findManyUserReservations = async (req, res) => {
    if (!(await validateRecordExists(userClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await reservationClient.findMany({where: {user_id: req.params.id}, include: {book: true}})
    res.status(StatusCodes.OK).json(result)
}

export const findManyUserCart = async (req, res) => {
    if (!(await validateRecordExists(userClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await cartClient.findMany({where: {user_id: req.params.id}, include: {book: true}})
    res.status(StatusCodes.OK).json(result)
}

export const findManyUserNotifications = async (req, res) => {
    if (!(await validateRecordExists(userClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await notificationClient.findMany({where: {user_id: req.params.id}})
    res.status(StatusCodes.OK).json(result)
}

export const findManyUserPayments = async (req, res) => {
    if (!(await validateRecordExists(userClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await paymentClient.findMany({where: {user_id: req.params.id}})
    res.status(StatusCodes.OK).json(result)
}

export const findManyUserBooksRead = async (req, res) => {
    if (!(await validateRecordExists(userClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await booksReadClient.findMany({where: {user_id: req.params.id}, include: {book: true}})
    res.status(StatusCodes.OK).json(result)
}

