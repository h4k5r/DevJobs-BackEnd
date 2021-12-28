import {NextFunction, Request, Response} from 'express';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const getSalt = async () => {
    return await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS!));
};
export const extractToken = (req: Request): string => {
    const authorization = req.headers.authorization;
    if (authorization) {
        return authorization.split(' ')[1];
    }
    return '';
};

export const checkToken = (token: string, secret: string, res: Response, next: NextFunction) => {
    if (!token) {
        return res.status(400).json({
            success: false,
            message: "No token provided"
        });
    }
    let isValid = false;
    jwt.verify(token, secret, (err, _) => {
        if (err) {
            return
        }
        isValid = true;
    });
    if (isValid) {
        next();
        return;
    }
    res.status(400).json({
        success: false,
        message: "Token is invalid"
    });
};