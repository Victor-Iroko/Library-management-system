import { notificationClient } from "config/client"
import { notFoundError } from "errors/not-found"
import { StatusCodes } from "http-status-codes"
import { validateRecordExists } from "utils/validateRecord"
import { validator } from "utils/validator"
import { createNotificationSchema, updateNotificationSchema } from "validation/notification"


export const findManyNotifications = async (req, res) => {
    const result = await notificationClient.findMany()
    res.status(StatusCodes.OK).json(result)
}


export const createNotification = async (req, res) => {
    const data = await validator(req.body, createNotificationSchema)
    const result = await notificationClient.create({data: {...data}})
    res.status(StatusCodes.CREATED).json(result)
}

export const updateNotification = async (req, res) => {
    if (!(await validateRecordExists(notificationClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const data = await validator(req.body, updateNotificationSchema)
    const result = await notificationClient.update({where: {id: req.params.id}, data: {...data}})
    res.status(StatusCodes.OK).json(result)
}