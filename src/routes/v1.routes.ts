import express from 'express';
import userRouter from './v1/users.route';
import authRouter from './v1/auth.route';
import searchRouter from './v1/search.route';
import postRouter from './v1/post.route';
import commentRouter from './v1/comment.route';
import { authenticationMiddleware } from '../middlewares/authentication';

const v1Router = express.Router();

v1Router.use('/search', searchRouter);
v1Router.use('/auth', authRouter);
v1Router.use('/user', authenticationMiddleware, userRouter);
v1Router.use('/post', authenticationMiddleware, postRouter);
v1Router.use('/comment', authenticationMiddleware, commentRouter);

export default v1Router;
