import express from 'express';
import { createPost, deletePost, getPost, likePost, unLikePost, updatePost } from '../../controllers/v1/post.controller';

const postRouter = express.Router();

// POST /api/v1/post/
postRouter.post('/', createPost);

// PUT /api/v1/post/:id
postRouter.put('/:post_id', updatePost);

// DELETE /api/v1/post/:id
postRouter.delete('/:post_id', deletePost);

// GET /api/v1/post/:id
postRouter.get('/:post_id', getPost);

// POST /api/v1/post/:id/like
postRouter.post('/:post_id/like', likePost);

// POST /api/v1/post/:id/unlike
postRouter.delete('/:post_id/like', unLikePost);
export default postRouter;
