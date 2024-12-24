// schemas to validate every query parameter from req.query for pagination, sorting and filtering
import { bookStatusEnum, genreEnum, notificationType, reservationStatusEnum, userRole } from '@prisma/client'
import Joi from 'joi'
import { finished } from 'stream'
import { validateColumnwithJoi } from './validateColumn'


export const getsBooksReadByUserSchema = Joi.object({
    page: Joi.number().min(0),
    perPage: Joi.number().min(0),
    sortField: Joi.string().pattern(/^([\w\s]+)(,([\w\s]+))*$/).custom(validateColumnwithJoi(['booksRead', 'book'])),
    sortOrder: Joi.string().valid('asc', 'desc'),
    filter: Joi.object({
        finished: Joi.boolean(),
        rating: Joi.object({
            gte: Joi.number().min(0).max(5),
            lte: Joi.number().min(0).max(5),
            gt: Joi.number().min(0).max(5),
            lt: Joi.number().min(0).max(5),
            equals: Joi.number().min(0).max(5),
            not: Joi.number().min(0).max(5),
        }),
        title: Joi.string(),
        author: Joi.string(),
        genre: Joi.string().valid(...Object.values(genreEnum)),
        publication_year: Joi.object({
            gte: Joi.date(),
            lte: Joi.date(),
            gt: Joi.date(),
            lt: Joi.date(),
            equals: Joi.date(),
            not: Joi.date(),
        }),
        status: Joi.string().valid(...Object.values(bookStatusEnum))
    })
}).and('sortField', 'sortOrder')



export const getNotificationSchema = Joi.object({
    page: Joi.number().min(0),
    perPage: Joi.number().min(0),
    sortField: Joi.string().pattern(/^([\w\s]+)(,([\w\s]+))*$/).custom(validateColumnwithJoi(['notification'])),
    sortOrder: Joi.string().valid('asc', 'desc'),
    filter: Joi.object({
        type: Joi.string().valid(...Object.values(notificationType)),
        is_read: Joi.bool()
    })
}).and('sortField', 'sortOrder')


export const getBorrowHistorySchema = Joi.object({
    page: Joi.number().min(0),
    perPage: Joi.number().min(0),
    sortField: Joi.string().pattern(/^([\w\s]+)(,([\w\s]+))*$/).custom(validateColumnwithJoi(['borrowing', 'book'])),
    sortOrder: Joi.string().valid('asc', 'desc'),
    filter: Joi.object({
        borrow_date: Joi.date(),
        due_date: Joi.date(),
        return_date: Joi.date(),
        returned: Joi.boolean(),
        fine_amount: Joi.object({
            gte: Joi.number(),
            lte: Joi.number(),
            gt: Joi.number(),
            lt: Joi.number(),
            equals: Joi.number(),
            not: Joi.number(),
        }),
        rating: Joi.object({
            gte: Joi.number().min(0).max(5),
            lte: Joi.number().min(0).max(5),
            gt: Joi.number().min(0).max(5),
            lt: Joi.number().min(0).max(5),
            equals: Joi.number().min(0).max(5),
            not: Joi.number().min(0).max(5),
        }),
        title: Joi.string(),
        author: Joi.string(),
        genre: Joi.string().valid(...Object.values(genreEnum)),
        publication_year: Joi.object({
            gte: Joi.date(),
            lte: Joi.date(),
            gt: Joi.date(),
            lt: Joi.date(),
            equals: Joi.date(),
            not: Joi.date(),
        }),
        status: Joi.string().valid(...Object.values(bookStatusEnum))
    })
}).and('sortField', 'sortOrder')


export const getCartSchema = Joi.object({
    page: Joi.number().min(0),
    perPage: Joi.number().min(0),
    sortField: Joi.string().pattern(/^([\w\s]+)(,([\w\s]+))*$/).custom(validateColumnwithJoi(['cart', 'book'])),
    sortOrder: Joi.string().valid('asc', 'desc'),
    filter: Joi.object({
        reservation_status: Joi.string().valid(...Object.values(reservationStatusEnum)),
        rating: Joi.object({
            gte: Joi.number().min(0).max(5),
            lte: Joi.number().min(0).max(5),
            gt: Joi.number().min(0).max(5),
            lt: Joi.number().min(0).max(5),
            equals: Joi.number().min(0).max(5),
            not: Joi.number().min(0).max(5),
        }),
        title: Joi.string(),
        author: Joi.string(),
        genre: Joi.string().valid(...Object.values(genreEnum)),
        publication_year: Joi.object({
            gte: Joi.date(),
            lte: Joi.date(),
            gt: Joi.date(),
            lt: Joi.date(),
            equals: Joi.date(),
            not: Joi.date(),
        }),
        status: Joi.string().valid(...Object.values(bookStatusEnum))
    })
}).and('sortField', 'sortOrder')


export const getManyUserSchema = Joi.object({
    page: Joi.number().min(0),
    perPage: Joi.number().min(0),
    sortField: Joi.string().pattern(/^([\w\s]+)(,([\w\s]+))*$/).custom(validateColumnwithJoi(['user'])),
    sortOrder: Joi.string().valid('asc', 'desc'),
    filter: Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        phone_number: Joi.string().pattern(/^\d+$/).length(11),
        role: Joi.string().valid(...Object.values(userRole))
    })
}).and('sortField', 'sortOrder')


export const getBooksSchema = Joi.object({
    page: Joi.number().min(0),
    perPage: Joi.number().min(0),
    sortField: Joi.string().pattern(/^([\w\s]+)(,([\w\s]+))*$/).custom(validateColumnwithJoi(['book'])),
    sortOrder: Joi.string().valid('asc', 'desc'),
    filter: Joi.object({
        rating: Joi.object({
            gte: Joi.number().min(0).max(5),
            lte: Joi.number().min(0).max(5),
            gt: Joi.number().min(0).max(5),
            lt: Joi.number().min(0).max(5),
            equals: Joi.number().min(0).max(5),
            not: Joi.number().min(0).max(5),
        }),
        title: Joi.string(),
        author: Joi.string(),
        genre: Joi.string().valid(...Object.values(genreEnum)),
        publication_year: Joi.object({
            gte: Joi.date(),
            lte: Joi.date(),
            gt: Joi.date(),
            lt: Joi.date(),
            equals: Joi.date(),
            not: Joi.date(),
        }),
        status: Joi.string().valid(...Object.values(bookStatusEnum))
    })
}).and('sortField', 'sortOrder')


export const getManyUserWhoBorrowedSchema = Joi.object({
    page: Joi.number().min(0),
    perPage: Joi.number().min(0),
    sortField: Joi.string().pattern(/^([\w\s]+)(,([\w\s]+))*$/).custom(validateColumnwithJoi(['user', 'borrowing'])),
    sortOrder: Joi.string().valid('asc', 'desc'),
    filter: Joi.object({
        borrow_date: Joi.object({
            gte: Joi.date(),
            lte: Joi.date(),
            gt: Joi.date(),
            lt: Joi.date(),
            equals: Joi.date(),
            not: Joi.date(),
        }),
        due_date: Joi.object({
            gte: Joi.date(),
            lte: Joi.date(),
            gt: Joi.date(),
            lt: Joi.date(),
            equals: Joi.date(),
            not: Joi.date(),
        }),
        return_date: Joi.object({
            gte: Joi.date(),
            lte: Joi.date(),
            gt: Joi.date(),
            lt: Joi.date(),
            equals: Joi.date(),
            not: Joi.date(),
        }),
        fine_amount: Joi.object({
            gte: Joi.number().min(0).max(5),
            lte: Joi.number().min(0).max(5),
            gt: Joi.number().min(0).max(5),
            lt: Joi.number().min(0).max(5),
            equals: Joi.number().min(0).max(5),
            not: Joi.number().min(0).max(5),
        }),
        returned: Joi.boolean(),
        name: Joi.string(),
        email: Joi.string().email(),
        phone_number: Joi.string().pattern(/^\d+$/).length(11),
        role: Joi.string().valid(...Object.values(userRole))
    })
}).and('sortField', 'sortOrder')


export const getManyUserWhoReservedSchema = Joi.object({
    page: Joi.number().min(0),
    perPage: Joi.number().min(0),
    sortField: Joi.string().pattern(/^([\w\s]+)(,([\w\s]+))*$/).custom(validateColumnwithJoi(['user', 'reservation'])),
    sortOrder: Joi.string().valid('asc', 'desc'),
    filter: Joi.object({
        reservation_date: Joi.object({
            gte: Joi.date(),
            lte: Joi.date(),
            gt: Joi.date(),
            lt: Joi.date(),
            equals: Joi.date(),
            not: Joi.date(),
        }),
        reservation_status: Joi.string().valid(...Object.values(reservationStatusEnum)),
        name: Joi.string(),
        email: Joi.string().email(),
        phone_number: Joi.string().pattern(/^\d+$/).length(11),
        role: Joi.string().valid(...Object.values(userRole))
    })
}).and('sortField', 'sortOrder')