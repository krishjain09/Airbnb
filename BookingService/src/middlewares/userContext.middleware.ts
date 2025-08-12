import { RequestHandler } from 'express';

export const userContext: RequestHandler = (req, res, next) => {
    const userId = req.headers['x-user-id'] as string | undefined;
    console.log("userId in userContext middleware:", userId);
    if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    (req as any).userId = userId;
    next();
};