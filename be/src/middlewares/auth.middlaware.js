import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma/index.js';

export default async function authMiddleware(req, res, next) {
    try {
        const { authorization } = req.headers;
        if (!authorization) throw new Error('can not find token');

        const [tokenType, token] = authorization.split(' ');

        if (tokenType !== 'Bearer')
            throw new Error('token type is not matched');

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const email = decodedToken.email;

        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            throw new Error('there is no right token user');
        }

        // req.user에 사용자 정보를 저장합니다.
        req.user = user;

        next();
    } catch (error) {

        switch (error.name) {
            case 'TokenExpiredError':
                return res.status(401).json({ message: 'token expired.' });
            case 'JsonWebTokenError':
                return res.status(401).json({ message: 'token manipulated.' });
            default:
                return res
                    .status(401)
                    .json({ message: error.message ?? 'unusual request.' });
        }
    }
}