import Joi from "joi"
import {validateRecordWithJoi} from '../utils/validateRecord'
import { bookClient, userClient } from "../config/client"


export const createCartSchema = Joi.object({
    user_id: Joi.string().external(validateRecordWithJoi(userClient)).required(),
    book_id: Joi.string().external(validateRecordWithJoi(bookClient)).required(),
})



