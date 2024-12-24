import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { StatusCodes } from 'http-status-codes'
import {forbiddenError} from '../errors/index'
import { userRole } from '@prisma/client'
dotenv.config()


// checks if there is an access token (i.e. if the user has logged in)
export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) return res.status(StatusCodes.UNAUTHORIZED).json({message: "Authorization token missing or malformed"})
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) throw new forbiddenError("Invalid or expired token")
        req.id = decoded.userInfo.id
        req.role = decoded.userInfo.role
        next()
    })
}


export const verifyRoles = (...allowedRoles) => (req, res, next) => {
    // allowedRoles is like ["ADMIN", 'Manager']
    if (!req?.role) return res.status(StatusCodes.FORBIDDEN).json("Role missing from request")
    const isAllowed =  allowedRoles.includes(req.role)
    if (!isAllowed) return res.status(StatusCodes.UNAUTHORIZED).json("User role is unauthorized to make this request")
    next()
}


export const verifyJWTForRegistration = (req, res, next) => {
    const role = req.body.role;
    
    // If registering a user role, no additional checks are required
    if (!role || role === userRole.USER) {
        return next();
    }

    // Require JWT and admin role for "ADMIN" or "LIBRARIAN" roles
    verifyJWT(req, res, (err) => {
        if (err) return; // Pass the error from `verifyJWT`
        verifyRoles(userRole.ADMIN)(req, res, next);
    });
};



