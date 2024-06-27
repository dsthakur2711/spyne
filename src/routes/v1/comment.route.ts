import express from 'express';
import {
  createComment,
  deleteComment,
  updateComment,
  getComment,
  likeComment,
  unLikeComment,
  replyComment,
} from '../../controllers/v1/comments.controller';

const commentRouter = express.Router();

// POST /api/v1/comment/:comment_id
commentRouter.get('/:comment_id', getComment);

// POST /api/v1/comment/
commentRouter.post('/', createComment);

// PUT /api/v1/comment/:comment_id
commentRouter.put('/:comment_id', updateComment);

// DELETE /api/v1/comment/:comment_id
commentRouter.delete('/:comment_id', deleteComment);

// POST /api/v1/comment/:comment_id/like
commentRouter.post('/:comment_id/like', likeComment);

// POST /api/v1/comment/:comment_id/unlike
commentRouter.post('/:comment_id/unlike', unLikeComment);

// POST /api/v1/comment/:comment_id/reply
commentRouter.post('/:comment_id/reply', replyComment);

export default commentRouter;
