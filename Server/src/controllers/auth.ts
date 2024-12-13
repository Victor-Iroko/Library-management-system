import { userClient } from "config/client";
import { StatusCodes } from "http-status-codes";
import { validator } from "utils/validator"
import { loginUserSchema } from "validation/auth";
import { createUserSchema } from "validation/user"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { log } from "console";


export const register = async (req, res) => {
    // req.body must contain name, email, phone_number, password and confirm_password
    req.body.role = "USER"
    const data = await validator(req.body, createUserSchema)
    const result = await userClient.create({ data });
    res.status(StatusCodes.CREATED).json(result);
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
            { userInfo: { name: user.name, role: user.role } }, // payload should not be sensitive information
            process.env.ACCESS_TOKEN,
            { expiresIn: '5m' }
        );

        const refreshToken = jwt.sign(
            { userInfo: { name: user.name, role: user.role } },
            process.env.REFRESH_TOKEN,
            { expiresIn: '1d' }
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
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
    if (err || user.name !== decoded.userInfo.name) return res.status(StatusCodes.FORBIDDEN)
    const accessToken = jwt.sign(
        {userInfo: {name: user.name, role: user.role}},
        process.env.ACCESS_TOKEN,
        {expiresIn: '5m'}
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





