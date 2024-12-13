import Joi from "joi"
import {validateRecordWithJoi} from '../utils/validateRecord'
import {userClient} from "../config/client"


export const createPaymentSchema = Joi.object({
    user_id: Joi.string().external(validateRecordWithJoi(userClient)).required(),
    amount: Joi.number().min(0).required()
})
