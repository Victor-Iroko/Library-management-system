import {customApiError} from './custom-error'
import {StatusCodes} from 'http-status-codes'

export class forbiddenError extends customApiError{
    constructor (message) {
        super(message)
        this.statusCode = StatusCodes.FORBIDDEN
    }
}