import Joi from "joi"
import moment from 'moment'
import {validateDuplicateRecordwithJoi} from '../utils/validateRecord'
import { bookClient } from "../config/client"
import {genreEnum, bookStatusEnum} from '@prisma/client'


export const createBookSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    genre: Joi.string().valid(...Object.values(genreEnum)).required(),
    isbn: Joi.string().required().pattern(/^(97(8|9))?\d{9}(\d|X)$/).external(validateDuplicateRecordwithJoi(bookClient, 'isbn')),
    publication_year: Joi.date().max(moment.now()).required(),
    total_copies: Joi.number().min(0)
})



export const updateBookSchema = Joi.object({
    title: Joi.string(),
    author: Joi.string(),
    genre: Joi.string().valid(...Object.values(genreEnum)),
    isbn: Joi.string().pattern(/^(97(8|9))?\d{9}(\d|X)$/).external(validateDuplicateRecordwithJoi(bookClient, 'ISBN')),
    publication_year: Joi.date().max(moment.now()),
    total_copies: Joi.number().min(0),
    status: Joi.string().valid(...Object.values(bookStatusEnum)).required()
})