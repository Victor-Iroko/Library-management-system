import Joi from "joi";
import moment from "moment";
import { validateColumnwithJoi } from "./validateColumn";
import { validateDuplicateRecordwithJoi, validateRecordWithJoi } from "./validateRecord";
import { bookStatusEnum, genreEnum, notificationType, userRole } from "@prisma/client";
import { bookClient, borrowClient, isbnClient, userClient } from "config/client";


export const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});


export const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required().external(validateDuplicateRecordwithJoi(userClient, 'email')),
    phone_number: Joi.string().pattern(/^\d+$/).length(11).required(),
    role: Joi.string().valid(...Object.values(userRole)).required(),
    password: Joi.string().min(6).required(),
    confirm_password: Joi.ref('password')
}).with("password", "confirm_password");



export const updateProfileSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email().optional().external((value) => value ? validateDuplicateRecordwithJoi(userClient, 'email') : undefined), // manually checked because it was checking if email was there even though emails not in option
    phone_number: Joi.string().pattern(/^\d+$/).length(11),
    password: Joi.string().min(6),
    confirm_password: Joi.ref('password'),
    role: Joi.string().valid(...Object.values(userRole)),
    refreshToken: Joi.string().allow("") // allow an empty string so we can clear it when user logs out
}).with("password", "confirm_password")



export const markNotificationReadSchema = Joi.object({
    is_read: Joi.boolean()
})


export const addToCartSchema = Joi.object({
    user_id: Joi.string().external(validateRecordWithJoi(userClient)).required(),
    book_id: Joi.string().external(validateRecordWithJoi(bookClient)).required(),
})


export const reserveBookSchema = Joi.object({
    user_id: Joi.string().external(validateRecordWithJoi(userClient)).required(),
    book_id: Joi.string().external(validateRecordWithJoi(bookClient)).required(),
})


export const addBookSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    genre: Joi.string().valid(...Object.values(genreEnum)).required(),
    publication_year: Joi.date().max(moment.now()).required(),
    status: Joi.string().valid(...Object.values(bookStatusEnum)),
    description: Joi.string().required(),
    cover_image: Joi.binary().max(1024 * 1024) // maximu size 1mb
})

export const addToReadSchema = Joi.object({
    user_id: Joi.string().external(validateRecordWithJoi(userClient)).required(),
    book_id: Joi.string().external(validateRecordWithJoi(bookClient)).required(),
})

export const updateBooksReadSchema = Joi.object({
    finished: Joi.boolean(),
    rating: Joi.number().min(0).max(5), // 0 stars to 5 stars
    review: Joi.string()
})

export const editBookSchema = Joi.object({
    title: Joi.string(),
    author: Joi.string(),
    genre: Joi.string().valid(...Object.values(genreEnum)),
    publication_year: Joi.date().max(moment.now()),
    status: Joi.string().valid(...Object.values(bookStatusEnum)),
    description: Joi.string(),
    cover_image: Joi.binary().max(1024 * 1024)
})



export const addISBNSchema = Joi.object({
    isbn: Joi.string().required().pattern(/^(97(8|9))?\d{9}(\d|X)$/).external(validateDuplicateRecordwithJoi(isbnClient, 'isbn')),
    bookId: Joi.string().external(validateRecordWithJoi(bookClient)).required()

})


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
}).and('returned', 'return_date');


export const createNotificationSchema = Joi.object({
    user_id: Joi.string().external(validateRecordWithJoi(userClient)).required(),
    type: Joi.string().valid(...Object.values(notificationType)).required(),
    content: Joi.string().required()
});


export const payFinesSchema = Joi.object({
    user_id: Joi.string().external(validateRecordWithJoi(userClient)).required(),
    borrow_id: Joi.array().items(Joi.string().external(validateRecordWithJoi(borrowClient))).required()
});







