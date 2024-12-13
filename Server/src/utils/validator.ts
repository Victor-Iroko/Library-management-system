import { badRequest } from "errors";

export const validator = async (data, schema) => {
    try {
        const { value } = await schema.validateAsync(data, {abortEarly:false}); // gives all the errors not just the first one
        return value !== undefined ? value : data; // I can't destructure an undefined value
    } catch (error) {
        const errorMessages = Array.isArray(error.details) ? error.details.map((detail) => detail.message).join(', ') : error.details?.message || error.message || '';  
        throw new badRequest(errorMessages)  // update error handler to be able to display all errors at once
    }
};