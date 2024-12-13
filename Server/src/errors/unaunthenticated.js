import {customApiError} from './custom-error'
import { StatusCodes } from 'http-status-codes'

export class unAuthenticatedError extends customApiError{
    constructor (message) {
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}