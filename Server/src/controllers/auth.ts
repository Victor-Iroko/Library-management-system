import { userClient } from "config/client";
import { StatusCodes } from "http-status-codes";
import { validator } from "utils/validator"
import { loginUserSchema, registerSchema } from "utils/body-validation-schemas";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userRole } from "@prisma/client";
import ck from 'ckey'


export const register = async (req, res, next) => {
        const data = await validator(req.body, registerSchema);
        // Check if the role is "ADMIN" or "LIBRARIAN"
        if ([userRole.ADMIN, userRole.LIBRARIAN].includes(data.role)) {
            // Ensure request is validated by `verifyJWT` and `verifyRoles` middleware
            if (!req.role || req.role !== userRole.ADMIN) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    message: "Only admins can register other admins or librarians",
                });
            }
        }
        // Create the user
        const result = await userClient.create({ data });
        return res.status(StatusCodes.CREATED).json(result);
    }



export const login = async (req, res) => {    
    // req.body must contain email and password
    const {email, password} = await validator(req.body, loginUserSchema)
    const user = await userClient.findUnique({where: {email: email}})
    if (!user) { return res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not registered" }); }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
        // create token 
        // run require('crypto').randomBytes(64).toString('hex') in command line to get random tokens
        const accessToken = jwt.sign(
            { userInfo: { id: user.id, role: user.role } }, // payload should not be sensitive information
            ck.ACCESS_TOKEN,
            { expiresIn: ck.ACCESS_TOKEN_TIME }
        );

        const refreshToken = jwt.sign(
            { userInfo: { id: user.id, role: user.role } },
            ck.REFRESH_TOKEN,
            { expiresIn: ck.REFRESH_TOKEN_TIME }
        );
        
        await userClient.update({
            where: { id: user.id },
            data: { refreshToken: refreshToken }
        })

        // in production add the option `secure: true` which makes it serve only on https (localhost uses http)
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }); // if you send your cookie as http only another person cannot use js to access it 

        // max age is one day (its in milliseconds)
        return res.status(StatusCodes.OK).json({ message: "User has successfully logged in", accessToken });
    } else {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Password is incorrect" });
    }

}

export const refreshToken = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(StatusCodes.UNAUTHORIZED).json({message: "No jwt cookie"})
    const refreshToken = cookies.jwt
    const user = await userClient.findFirst({where: {refreshToken: refreshToken}})
    if (!user) return res.status(StatusCodes.FORBIDDEN).json({message: "User forbidden from making this request"})
    jwt.verify(refreshToken, ck.REFRESH_TOKEN, (err, decoded) => {
    if (err || user.id !== decoded.userInfo.id) return res.status(StatusCodes.FORBIDDEN)
    const accessToken = jwt.sign(
        {userInfo: {id: user.id, role: user.role}},
        ck.ACCESS_TOKEN,
        {expiresIn: ck.ACCESS_TOKEN_TIME}
    )
    
    
    return res.json({accessToken})
    })
}


export const logout = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(StatusCodes.NO_CONTENT);
    const refreshToken = cookies.jwt
    const user = await userClient.findFirst({where: {refreshToken: refreshToken}})
    if (!user) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(StatusCodes.NO_CONTENT);
    }

    await userClient.update({
        where: { id: user.id },
        data: { refreshToken: "" }
    })

    res.clearCookie('jwt', { httpOnly: true });
    return res.sendStatus(StatusCodes.NO_CONTENT);

}





