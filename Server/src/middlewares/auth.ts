import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { StatusCodes } from 'http-status-codes'
import {forbiddenError} from '../errors/index'
dotenv.config()


// checks if there is an access token (i.e. if the user has logged in)
export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) return res.status(StatusCodes.UNAUTHORIZED).json({message: "No jwt token"})
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        console.log(decoded);
        
        if (err) throw new forbiddenError("Token not valid")
        req.name = decoded.userInfo.name
        req.role = decoded.userInfo.role
        next()
    })
}


export const verifyRoles = (...allowedRoles) => (req, res, next) => {
    // allowedRoles is like ["ADMIN", 'Manager']
    if (!req?.role) return res.status(StatusCodes.UNAUTHORIZED).json("User does not have a role")
    const [rolesArray] = [...allowedRoles]
    const role = req.role
    const isAllowed =  rolesArray.includes(role)
    if (!isAllowed) return res.status(StatusCodes.UNAUTHORIZED).json("User role is unauthorized to make this request")
    next()
}
