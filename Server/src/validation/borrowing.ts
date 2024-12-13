import Joi from "joi"
import moment from 'moment'
import {validateRecordWithJoi} from '../utils/validateRecord'
import { bookClient, userClient } from "../config/client"


export const createBorrowSchema = Joi.object({
    user_id: Joi.string().external(validateRecordWithJoi(userClient)).required(),
    book_id: Joi.string().external(validateRecordWithJoi(bookClient)).required(),
    due_date: Joi.date().min(moment.now()).required()
})






export const updateborrowSchema = Joi.object({
    due_date: Joi.date().min(moment.now()),
    return_date: Joi.date().min(moment.now()),
    returned: Joi.boolean(),
    fine_amount: Joi.number().min(0)
}).and('returned', 'return_date')