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

    processPayment = async (bookerId, postId) => {
        return await prisma.$transaction(async (prisma) => {
            // 예약 및 게시글 정보 조회
            const user = await prisma.user.findUnique({
                where: { id: bookerId },
                include: {
                    reservationsMade: {
                        where: {
                            postId: postId,
                            isPaid: false
                        },
                        include: {
                            post: {
                                include: {
                                    author: true
                                }
                            }
                        }
                    }
                }
            });

            // 예약이 없거나 이미 결제된 경우 처리
            if (!user || user.reservationsMade.length === 0) {
                throw new Error('Reservation not found or already paid');
            }

            // reservationsMade 배열에서 첫 번째 예약만 사용
            const reservation = user.reservationsMade[0];

            // 추가적인 확인으로 isPaid가 false인지 체크
            if (reservation.isPaid) {
                throw new Error('This reservation has already been paid');
            }

            const cost = reservation.post.cost || 0;

            // 예약자의 포인트가 충분하지 않을 경우 오류 발생
            if (user.point < cost) {
                throw new Error('Insufficient points');
            }

            // 트랜잭션 내에서 포인트 처리 및 상태 업데이트
            const updatedBooker = await prisma.user.update({
                where: { id: bookerId },
                data: { point: { decrement: cost } },
                select: { // 비밀번호를 제외하고 선택
                    id: true,
                    email: true,
                    name: true,
                    gender: true,
                    point: true,
                    role: true
                }
            });

            const updatedAuthor = await prisma.user.update({
                where: { id: reservation.post.authorId },
                data: { point: { increment: cost } },
                select: { // 비밀번호를 제외하고 선택
                    id: true,
                    email: true,
                    name: true,
                    gender: true,
                    point: true,
                    role: true
                }
            });

            const updatedReservation = await prisma.reservation.update({
                where: { id: reservation.id },
                data: { isPaid: true }
            });

            return { updatedBooker, updatedAuthor, updatedReservation };
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
