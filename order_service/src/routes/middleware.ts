import express, { NextFunction, Request, Response } from 'express'
import { validateUser } from '../utils';

export const RequestAuthorizer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.authorization)
            return res.status(401).json({ message: "Unauthorized due to authorization token missing!" })

        const userData = await validateUser(req.headers.authorization as string);
        req.user = userData;
        next();
    } catch (error) {
        return res.status(401).json({ error });
    }
};
