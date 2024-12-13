export class customApiError extends Error {
    constructor(message){
        const processedMessage = Array.isArray(message) ? message.join(", ") : message // if its an array convert to a string
        super(processedMessage)
    }
}