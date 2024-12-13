import Joi from "joi"
import {validateRecordWithJoi} from '../utils/validateRecord'
import {userClient } from "../config/client"
import { notificationType} from "@prisma/client"


export const createNotificationSchema = Joi.object({
    user_id: Joi.string().external(validateRecordWithJoi(userClient)).required(),
    type: Joi.string().valid(...Object.values(notificationType)).required(),
    content: Joi.string().required()
})




export const updateNotificationSchema = Joi.object({
    is_read: Joi.boolean()
})