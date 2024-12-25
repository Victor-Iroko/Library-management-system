import { Prisma, userRole } from "@prisma/client";
import { booksReadClient, borrowClient, cartClient, notificationClient, paymentClient, reservationClient, userClient } from "config/client";
import { forbiddenError } from "errors";
import { notFoundError } from "errors/not-found";
import { StatusCodes } from "http-status-codes";
import { validateRecordExists } from "utils/validateRecord";
import { validator } from "utils/validator";
import { markNotificationReadSchema, payFinesSchema } from "utils/body-validation-schemas";
import { updateProfileSchema } from "utils/body-validation-schemas";
import { getBorrowHistorySchema, getCartSchema, getManyUserSchema, getNotificationSchema, getsBooksReadByUserSchema } from "utils/query-validation-schemas";
import { createPaginationQuery } from "utils/pagination";
import { makePayment, verifyPaymentFunction } from "utils/payment";



export const getBooksRead = async (req, res) => {
    const userIdFromParams = req.params.id;
    if (!(await validateRecordExists(userClient, userIdFromParams))) throw new notFoundError(`The record does not exist`)

    const userIdFromToken = req.id;
    if (userIdFromParams !== userIdFromToken) { // only allows the person logged in to access their own record
        throw new forbiddenError("You are not authorized to access this record");
    }

    // pagination, sorting and filtering
    const data = await validator(req.query, getsBooksReadByUserSchema)

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

    const query = await createPaginationQuery({...data, include: {book: true}})
    query.where['user_id'] = userIdFromParams
    ratings ? query.where['book_id'] = {in: ratings.map(rating => rating.book_id)} : undefined
    
    
    const result = await booksReadClient.findMany(query)
    
    // find a way to add the avg_rating to the book info
    // result.forEach(element => {
    //     const avgRating = ratings.find(rating => rating.book_id === element.book_id);
    //     if (avgRating && element.book) { // Add a check to ensure element.book exists
    //     element.avg_rating = avgRating
    //     }
    //   });

    res.status(StatusCodes.OK).json(result)
}



export const getModelRecommendations = async (req, res) => {
    res.status(StatusCodes.OK).json({message: "Not yet implemented"})
}


export const getProfile = async (req, res) => {
    const userIdFromParams = req.params.id;
    if (!(await validateRecordExists(userClient, userIdFromParams))) throw new notFoundError(`The record does not exist`)

    const userIdFromToken = req.id;
    if ((userIdFromParams !== userIdFromToken) && (req.role === userRole.USER)) { // only allows the person logged in to access their own record
        throw new forbiddenError("You are not authorized to access this record");
    }

    const user = await userClient.findUnique({where: {id: userIdFromParams}})
    res.status(StatusCodes.OK).json(user)
}


export const updateProfile = async (req, res) => {
    const userIdFromParams = req.params.id;
    if (!(await validateRecordExists(userClient, userIdFromParams))) throw new notFoundError(`The record does not exist`)

    const userIdFromToken = req.id;
    if ((userIdFromParams !== userIdFromToken) && (req.role !== userRole.ADMIN)) { // only allows the person logged in to access their own record
        throw new forbiddenError("You are not authorized to access this record");
    }
    const data = await validator(req.body, updateProfileSchema)
    await userClient.update({where: {id: req.params.id}, data})
    res.status(StatusCodes.OK).json({message: "User information has been updated"})
}



export const getNotifications = async (req, res) => {
    const userIdFromParams = req.params.id;
    if (!(await validateRecordExists(userClient, userIdFromParams))) throw new notFoundError(`The record does not exist`)

    const userIdFromToken = req.id;
    if (userIdFromParams !== userIdFromToken) { // only allows the person logged in to access their own record
        throw new forbiddenError("You are not authorized to access this record");
    }

    
    const data = await validator(req.query, getNotificationSchema)
    const query = await createPaginationQuery({...data})
    query.where['user_id'] = userIdFromParams
    const result = await notificationClient.findMany(query)
    res.status(StatusCodes.OK).json(result)
}



export const markNotificationRead = async (req, res) => {
    if (!(await validateRecordExists(notificationClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const data = await validator(req.body, markNotificationReadSchema)
    const result = await notificationClient.update({where: {id: req.params.id}, data: {...data}})
    res.status(StatusCodes.OK).json(result)
}



export const getBorrowHistory = async (req, res) => {
    const userIdFromParams = req.params.id;
    if (!(await validateRecordExists(userClient, userIdFromParams))) throw new notFoundError(`The record does not exist`)

    const userIdFromToken = req.id;
    if ((userIdFromParams !== userIdFromToken) && (req.role === userRole.USER)) { 
        throw new forbiddenError("You are not authorized to access this record");
    }

    const data = await validator(req.query, getBorrowHistorySchema)
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

    
    const query = await createPaginationQuery({...data, include: {book: true}})
    query.where['user_id'] = userIdFromParams
    ratings ? query.where['book_id'] = {in: ratings.map(rating => rating.book_id)} : undefined

    const result = await borrowClient.findMany(query)
    res.status(StatusCodes.OK).json(result)
}


export const payFines = async (req, res) => {
    const data = await validator(req.body, payFinesSchema)
    const fineArray = await borrowClient.findMany({
        where: {id: {in: data.borrow_id}},
        select: {fine_amount: true},
    })

    const email = (await userClient.findUnique({where: {id: data.user_id}, select: {email: true}})).email
    const amount = fineArray.reduce((sum, entry) => sum + entry.fine_amount, 0) * 100; // multiply by 100 due to the way paystack handles money
    const payFine = await makePayment(email, amount)
    res.status(StatusCodes.OK).json(payFine)
}

export const verifyPayment = async (req, res) => {
    const status = await verifyPaymentFunction(req.params.reference)

    if (status['status'] === true) {
        const transactionData = {
          status: status['data'].status,       
          amount: status['data'].amount,       
          reference: status['data'].reference, 
        };

        const payment = await paymentClient.create({
            data:{
                user_id: req.id, 
                amount: transactionData.amount / 100,
                reference: transactionData.reference
            }
        })


        res.status(StatusCodes.OK).json(payment)
    } else {
        res.status(StatusCodes.OK).json({message: "The payment was not successful"})
    }

   
   

}


export const getCart = async (req, res) => {
    const userIdFromParams = req.params.id;
    if (!(await validateRecordExists(userClient, userIdFromParams))) throw new notFoundError(`The record does not exist`)

    const userIdFromToken = req.id;
    if ((userIdFromParams !== userIdFromToken) && (req.role === userRole.USER)) { 
        throw new forbiddenError("You are not authorized to access this record");
    }


    const data = await validator(req.query, getCartSchema)
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

    
    const query = await createPaginationQuery({...data, include: {book: true}})
    query.where['user_id'] = userIdFromParams
    ratings ? query.where['book_id'] = {in: ratings.map(rating => rating.book_id)} : undefined

    
    const result = await cartClient.findMany(query)

    res.status(StatusCodes.OK).json(result)
}




export const getReservations = async (req, res) => {
    const userIdFromParams = req.params.id;
    if (!(await validateRecordExists(userClient, userIdFromParams))) throw new notFoundError(`The record does not exist`)

    const userIdFromToken = req.id;
    if ((userIdFromParams !== userIdFromToken) && (req.role === userRole.USER)) { 
        throw new forbiddenError("You are not authorized to access this record");
    }

    const data = await validator(req.query, getCartSchema)
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

    
    const query = await createPaginationQuery({...data, include: {book: true}})
    query.where['user_id'] = userIdFromParams
    ratings ? query.where['book_id'] = {in: ratings.map(rating => rating.book_id)} : undefined

    const result = await reservationClient.findMany(query)

    res.status(StatusCodes.OK).json(result)
}



export const deleteUser = async (req, res) => {
    const userIdFromParams = req.params.id;
    if (!(await validateRecordExists(userClient, userIdFromParams))) throw new notFoundError(`The record does not exist`)

    const userIdFromToken = req.id;
    if ((userIdFromParams !== userIdFromToken) && (req.role !== userRole.ADMIN)) { // only allows the person logged in to access their own record
        throw new forbiddenError("You are not authorized to access this record");
    }


    await userClient.delete({where: {id: userIdFromParams}})
    res.status(StatusCodes.OK).json({message: "User has been deleted"})
}



export const getAllUsers = async (req, res) => {
    // add pagination here
    const data = await validator(req.query, getManyUserSchema)
    const query = await createPaginationQuery({...data})
    
    const user = await userClient.findMany(query)
    res.status(StatusCodes.OK).json(user)
}





