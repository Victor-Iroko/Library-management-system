import {customApiError} from './custom-error'
import {StatusCodes} from 'http-status-codes'

export class badRequest extends customApiError{
    constructor (message) {
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}