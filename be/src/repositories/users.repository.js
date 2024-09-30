import { prisma } from '../utils/prisma/index.js';

export class UsersRepository {

    findAllUsers = async () => {
        const users = await prisma.user.findMany();
        return users;
    };

    findUserById = async (id) => {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id, 10) },
            select: {
                id: true,
                email: true,
                name: true,
                gender: true,
                point: true,
                role: true
            }
        });
        return user;
    };

    findUserByEmail = async (email) => {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return user;
    };

    createUser = async (email, password, name, gender, role) => {
        const createdUser = await prisma.user.create({
            data: { email, password, name, gender, role },
        });
        return createdUser;
    };

    updateUser = async (id, data) => {
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id, 10) },
            data: data
        });
        return updatedUser;
    };

    deleteUser = async (id) => {
        await prisma.user.delete({
            where: { id: parseInt(id, 10) },
        });
        return true;
    };

    processPayment = async (payer, receiver, cost) => {
        return await prisma.$transaction(async (prisma) => {
            const payUser = await prisma.user.findUnique({
                where: { id: payer },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    gender: true,
                    point: true,
                    role: true
                }
            });

            const receiveUser = await prisma.user.findUnique({
                where: { id: receiver },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    gender: true,
                    point: true,
                    role: true
                }
            });

            if (!payUser || !receiveUser) {
                throw new Error('Both users must exist for the transaction');
            }

            if (payUser.point < cost) {
                throw new Error('Insufficient points');
            }

            const updatedPayer = await prisma.user.update({
                where: { id: payer },
                data: { point: { decrement: cost } },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    gender: true,
                    point: true,
                    role: true
                }
            });

            const updatedReceiver = await prisma.user.update({
                where: { id: receiver },
                data: { point: { increment: cost } },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    gender: true,
                    point: true,
                    role: true
                }
            });

            return { updatedPayer, updatedReceiver };
        });
    }

    getUserReservations = async (userId) => {
        return await prisma.reservation.findMany({
            where: { bookerId: userId },
            include: {
                post: true
            }
        });
    }

    getUserPosts = async (userId) => {
        return await prisma.post.findMany({
            where: { authorId: userId },
            include: {
                reservations: true
            }
        });
    }
}
