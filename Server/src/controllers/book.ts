import { bookClient, booksReadClient, borrowClient, cartClient, isbnClient, reservationClient, userClient } from "config/client"
import { notFoundError } from "errors/not-found"
import { StatusCodes } from "http-status-codes"
import { validateRecordExists } from "utils/validateRecord"
import { validator } from "utils/validator"
import { addBookSchema, addISBNSchema, editBookSchema } from "utils/body-validation-schemas"
import { addToReadSchema, updateBooksReadSchema } from "utils/body-validation-schemas"
import { addToCartSchema } from "utils/body-validation-schemas"
import { reserveBookSchema } from "utils/body-validation-schemas"
import { getBooksSchema, getManyUserWhoBorrowedSchema, getManyUserWhoReservedSchema } from "utils/query-validation-schemas"
import { createPaginationQuery } from "utils/pagination"
import { forbiddenError } from "errors"



export const getBooks = async (req, res) => {
    const data = await validator(req.query, getBooksSchema)
    let ratings
    if (data.filter?.rating) {
        const rating_query = await createPaginationQuery({filter: {rating: data.filter.rating}})
        
        const ratings_result = await booksReadClient.groupBy({
            by: ['book_id'],
            _avg: {rating: true},
            where: rating_query.where
        })
        
        ratings = ratings_result        
    
        delete data.filter.rating
    }

    
    const query = await createPaginationQuery({...data})
    ratings ? query.where['id'] = {in: ratings.map(rating => rating.book_id)} : undefined

    const result = await bookClient.findMany(query)
    res.status(StatusCodes.OK).json(result)    
}


export const getBooksDetails = async (req, res) => {
    if (!(await validateRecordExists(bookClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    let result
    
    result = await bookClient.findUnique({where: {id: req.params.id},  include: { 
        borrowing: { where: { user_id: req.id } }, 
        reservation: { where: { user_id: req.id } }, 
        cart: { where: { user_id: req.id } },
        booksRead: {where: {user_id: req.id}}
    }})


    result.reviews = await Promise.all((await booksReadClient.findMany({
        where: {book_id: req.params.id},
        select: {
            rating: true, 
            review: true,
            user_id: true
        }
    })).map(async (review) => {
        const user = await userClient.findUnique({
            where: { id: review.user_id},
            select: { name: true },
        });

        return {
            review: review.review,
            rating: review.rating,
            user_name: user?.name || "Unknown User", // Handle missing user gracefully
        };
    }))

    result.rating = (await booksReadClient.groupBy({
        by: ['book_id'],
        _avg: {rating: true},
        where: {book_id: req.params.id}
    }))[0]?._avg?.rating || null
    
    result.total_copies = (await isbnClient.groupBy({
        by: ['bookId'],
        _count: {isbn: true},
        where: {bookId: req.params.id}
    }))[0]?._count?.isbn || null



    result.copies_borrowed = (await borrowClient.groupBy({
        by: ['book_id'],
        _count: {user_id: true},
        where: {book_id: req.params.id}
    }))[0]?._count?.user_id || null

    result.copies_available = result.total_copies - result.copies_borrowed

    result.current_user_status = {
        borrowed: result.borrowing.length > 0 && !result.borrowing[0].returned, 
        due_date: result.borrowing.length > 0 ? result.borrowing[0].due_date : null,
        fine_amount: result.borrowing.length > 0 ? result.borrowing[0].fine_amount : 0,
        reservation_status: result.reservation.length > 0 ? result.reservation[0].reservation_status : null,
        cart: result.cart.length > 0,
        finished: result.booksRead.length > 0 && result.booksRead[0].finished
    }

    // delete all those foerign keys don't like them
    delete result.borrowing
    delete result.reservation
    delete result.cart
    delete result.booksRead
    
    res.status(StatusCodes.OK).json(result)
}



export const addToCart = async (req, res) => {
    const data = await validator(req.body, addToCartSchema)

    const userIdFromBody = req.body.user_id;
        if (!(await validateRecordExists(userClient, userIdFromBody))) throw new notFoundError(`The record does not exist`)
    
    const userIdFromToken = req.id;
    if (userIdFromBody !== userIdFromToken) { // only allows the person logged in to access their own record
        throw new forbiddenError("You are not authorized to access this record");
    }


    const result = await cartClient.create({data: {...data}})
    res.status(StatusCodes.OK).json(result)
}


export const removeFromCart = async (req, res) => {
    if (!(await validateRecordExists(cartClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await cartClient.delete({where: {id: req.params.id}})
    res.status(StatusCodes.OK).json(result)
}


export const reserveBook = async (req, res) => {
    const data = await validator(req.body, reserveBookSchema)

    const userIdFromBody = req.body.user_id;
        if (!(await validateRecordExists(userClient, userIdFromBody))) throw new notFoundError(`The record does not exist`)
    
    const userIdFromToken = req.id;
    if (userIdFromBody !== userIdFromToken) { // only allows the person logged in to access their own record
        throw new forbiddenError("You are not authorized to access this record");
    }

    const result = await reservationClient.create({data: {...data}})
    res.status(StatusCodes.CREATED).json(result)
}



export const cancelReservations = async (req, res) => {
    if (!(await validateRecordExists(reservationClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await reservationClient.delete({where: {id: req.params.id}})
    res.status(StatusCodes.OK).json(result)
}


export const addToBooksRead = async (req, res) => {
    const data = await validator(req.body, addToReadSchema)

    const userIdFromBody = req.body.user_id;
        if (!(await validateRecordExists(userClient, userIdFromBody))) throw new notFoundError(`The record does not exist`)
    
    const userIdFromToken = req.id;
    if (userIdFromBody !== userIdFromToken) { // only allows the person logged in to access their own record
        throw new forbiddenError("You are not authorized to access this record");
    }

    const result = await booksReadClient.create({data: {...data}})
    res.status(StatusCodes.OK).json(result)
}


export const reviewBook = async (req, res) => {
    if (!(await validateRecordExists(booksReadClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const data = await validator(req.body, updateBooksReadSchema)
    const result = await booksReadClient.update({where: {id: req.params.id}, data: {...data}})
    res.status(StatusCodes.OK).json(result)
}


export const addBook = async (req, res) => {
    const data = await validator(req.body, addBookSchema)
    const result = await bookClient.create({data: {...data}})
    res.status(StatusCodes.CREATED).json(result)
}

export const editBookInfo = async (req, res) => {
    if (!(await validateRecordExists(bookClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const data = await validator(req.body, editBookSchema)
    const result = await bookClient.update({where: {id: req.params.id}, data: {...data}})
    res.status(StatusCodes.OK).json(result)
}


export const deleteBook = async (req, res) => {
    if (!(await validateRecordExists(bookClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const result = await bookClient.delete({where: {id: req.params.id}})
    res.status(StatusCodes.OK).json(result)
}

export const getUsersWhoBorrowed = async (req, res) => {
    if (!(await validateRecordExists(bookClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    
    const data = await validator(req.query, getManyUserWhoBorrowedSchema)
    const query = await createPaginationQuery({...data, include: {user: true}})
    query.where['book_id'] = req.params.id
    
    const result = await borrowClient.findMany(query)

    res.status(StatusCodes.OK).json(result)
}


export const getUsersWhoReserved = async (req, res) => {
    if (!(await validateRecordExists(bookClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    
    const data = await validator(req.query, getManyUserWhoReservedSchema)
    const query = await createPaginationQuery({...data, include: {user: true}})
    query.where['book_id'] = req.params.id

    const result = await reservationClient.findMany(query)

    res.status(StatusCodes.OK).json(result)
}


export const addISBN = async (req, res) => {
    const data = await validator(req.body, addISBNSchema)
    console.log(data);
    
    const result = await isbnClient.create({data: {...data}})
    res.status(StatusCodes.CREATED).json(result)   
}


export const removeISBN = async (req, res) => {
    const result = await isbnClient.delete({where: {isbn: req.params.id}})
    res.status(StatusCodes.OK).json(result)
}

export const getIdFromISBN = async (req, res) => {
    const isbn = req.params.id 
    const result = await isbnClient.findUnique({where: {isbn: isbn}, select: {bookId: true}})
    res.status(StatusCodes.OK).json(result)
}