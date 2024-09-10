import { prisma } from '../utils/prisma/index.js';

export class PostsRepository {

    createPost = async (title, authorId) => {
        const createdPost = await prisma.post.create({
            data: {
                title,
                author: { connect: { id: authorId } },
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true,
                authorId: true
            }
        });
        return createdPost;
    }

    getPostById = async (id) => {
        const findedIdPost = await prisma.post.findUnique({
            where: { id: id },
            include: { reservations: true },
        });
        return findedIdPost;
    };

    getAllPosts = async () => {
        const posts = await prisma.post.findMany({
            include: { reservations: true },
        });
        return posts
    }

    updatePost = async (id, data) => {
        const updatedpost = await prisma.post.update({
            where: { id: id },
            data: data,
        });
        return updatedpost;
    };

    deletePost = async (id) => {
        const deletedpost = await prisma.post.delete({
            where: { id: id },
        });
        return deletedpost;
    };
};