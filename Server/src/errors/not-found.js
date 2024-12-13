import {customApiError} from './custom-error'
import {StatusCodes} from 'http-status-codes'

export class notFoundError extends customApiError{
    constructor (message) {
        super(message)
        this.statusCode = StatusCodes.NOT_FOUND
    }
}