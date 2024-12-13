import Joi from "joi"
import {validateRecordWithJoi} from '../utils/validateRecord'
import { bookClient, userClient } from "../config/client"
import { reservationStatusEnum } from "@prisma/client"


export const createReservationSchema = Joi.object({
    user_id: Joi.string().external(validateRecordWithJoi(userClient)).required(),
    book_id: Joi.string().external(validateRecordWithJoi(bookClient)).required(),
})





export const updateReservationSchema = Joi.object({
    reservation_status: Joi.string().valid(...Object.values(reservationStatusEnum))
})