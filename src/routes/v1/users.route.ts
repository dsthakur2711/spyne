import express from 'express';
import { deleteUser, followUser, getCurrentUser, getUser, unFollowUser, updateUser, updateUserPassword } from '../../controllers/v1/user.controller';

const userRouter = express.Router();

// PUT /api/v1/user/update
userRouter.put('/update', updateUser);

// PATCH /api/v1/user/password
userRouter.patch('/password', updateUserPassword);

// DELETE /api/v1/user
userRouter.delete('/', deleteUser);

// GET /api/v1/user/:id
userRouter.get('/:id', getUser);

// GET /api/v1/user/
userRouter.get('/', getCurrentUser);

// POST /api/v1/user/:id/follow
userRouter.post('/:following_user_id/follow', followUser);

// POST /api/v1/user/:id/follow
userRouter.delete('/:following_user_id/follow', unFollowUser);

export default userRouter;
