import Joi, { optional } from "joi"
import {validateDuplicateRecordwithJoi} from '../utils/validateRecord'
import { userClient } from "../config/client"
import { userRole } from "@prisma/client"

// schemma for validating when you want to create a user 
export const createUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required().external(validateDuplicateRecordwithJoi(userClient, 'email')),
    phone_number: Joi.string().pattern(/^\d+$/).length(11).required(),
    role: Joi.string().valid(...Object.values(userRole)),
    password: Joi.string().min(6).required(),
    confirm_password: Joi.ref('password')
}).with("password", "confirm_password")


// same as the create schema except none of the are required
export const updateUserSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email().optional().external((value) => value ? validateDuplicateRecordwithJoi(userClient, 'email'): undefined), // manually checked because it was checking if email was there even though emails not in option
    phone_number: Joi.string().pattern(/^\d+$/).length(11),
    password: Joi.string().min(6),
    confirm_password: Joi.ref('password'),
    roles: Joi.string().valid(...Object.values(userRole)),
    refreshToken: Joi.string().allow("") // allow an empty string so we can clear it when user logs out
}).with("password", "confirm_password")
