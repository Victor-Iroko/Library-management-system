import Joi from "joi"
import moment from 'moment'
import {validateDuplicateRecordwithJoi, validateRecordWithJoi} from '../utils/validateRecord'
import { bookClient, borrowClient, userClient } from "../config/client"


export const createBooksReadSchema = Joi.object({
    user_id: Joi.string().external(validateRecordWithJoi(userClient)).required(),
    book_id: Joi.string().external(validateRecordWithJoi(bookClient)).required(),
})


export const updateBooksReadSchema = Joi.object({
    finished: Joi.boolean(),
    finished_date: Joi.date().max(moment.now()),
    rating: Joi.number().min(0).max(5), // 0 stars to 5 stars
    review: Joi.string()
})