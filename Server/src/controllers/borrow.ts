import { bookStatusEnum, reservationStatusEnum } from "@prisma/client"
import { bookClient, borrowClient, isbnClient, reservationClient } from "config/client"
import { notFoundError } from "errors/not-found"
import { StatusCodes } from "http-status-codes"
import { validateRecordExists } from "utils/validateRecord"
import { validator } from "utils/validator"
import { createBorrowSchema, updateborrowSchema } from "utils/body-validation-schemas"
import { when } from "joi"



export const borrowBook = async (req, res) => {
    const data = await validator(req.body, createBorrowSchema)
    const result = await borrowClient.create({data: {...data}})
    
    // update the availability of the book
    const total_number_of_books = await isbnClient.count({where: {bookId: data.book_id}})
    const amount_borrowed = await borrowClient.count({where: {book_id: data.book_id}})
    if ((total_number_of_books - amount_borrowed) > 0){
        await bookClient.update({where: {id: data.book_id}, data: {status: bookStatusEnum.Available}})
    } else {
        await bookClient.update({where: {id: data.book_id}, data: {status: bookStatusEnum.Not_available}})
    }
    res.status(StatusCodes.OK).json(result)

    // check if the book was reserved and update accordingly
    const reserved = await reservationClient.findFirst({where: {user_id: data.user_id, book_id: data.book_id}})
    if (reserved) {
        await reservationClient.update({where: {id: reserved.id}, data: {reservation_status: reservationStatusEnum.Collected}})
    }

}


export const updateBorrow = async (req, res) => {
    if (!(await validateRecordExists(borrowClient, req.params.id))) throw new notFoundError(`The record does not exist`)
    const data = await validator(req.body, updateborrowSchema)
    const result = await borrowClient.update({ where: { id: req.params.id }, data: { ...data } })
    res.status(StatusCodes.OK).json(result)
}