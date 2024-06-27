import { controllerWrapper } from '../../lib/controllerWrapper';
import build_response from '../../lib/response/MessageResponse';
import { commentIdSchema, commentSchema, fetchCommentSchema } from '../../lib/zod/comment.schema';
import {
  createNewComment,
  deleteExistingComment,
  fetchComment,
  updateExistingComment,
  addLike,
  removeLike,
  replyToComment,
} from '../../services/comment.service';

// POST /api/v1/comment
export const createComment = controllerWrapper(async (req, res) => {
  const { post_id, text } = commentSchema.parse(req.body);

  const commentDetails = await createNewComment(req.user.id, post_id, text);

  const commentInfo = fetchCommentSchema.parse(commentDetails);
  res.status(200).json(build_response(true, 'Comment created successfully!', null, null, commentInfo));
});

// GET /api/v1/comment/:comment_id
export const getComment = controllerWrapper(async (req, res) => {
  const { comment_id } = commentIdSchema.parse(req.params);

  const comment = await fetchComment(comment_id);
  const commentInfo = await fetchCommentSchema.parse(comment);
  res.status(200).json(build_response(true, 'Comment fetched successfully!', null, null, commentInfo));
});

// DELETE /api/v1/comment/:comment_id
export const deleteComment = controllerWrapper(async (req, res) => {
  const { comment_id } = commentIdSchema.parse(req.params);

  await deleteExistingComment(req.user.id, comment_id);

  res.status(200).json(build_response(true, 'Comment deleted successfully!', null));
});

// PUT /api/v1/comment/:comment_id
export const updateComment = controllerWrapper(async (req, res) => {
  const { text } = commentSchema.parse(req.body);
  const { comment_id } = commentIdSchema.parse(req.params);

  const commentDetails = await updateExistingComment(req.user.id, comment_id, text);

  const commentInfo = fetchCommentSchema.parse(commentDetails);
  res.status(200).json(build_response(true, 'Comment updated successfully!', null, null, commentInfo));
});

// POST /api/v1/comment/:comment_id/like
export const likeComment = controllerWrapper(async (req, res) => {
  const { comment_id } = commentIdSchema.parse(req.params);

  await addLike(req.user.id, comment_id);

  res.status(200).json(build_response(true, 'Comment liked successfully!', null));
});

// DELETE /api/v1/comment/:comment_id/unlike
export const unLikeComment = controllerWrapper(async (req, res) => {
  const { comment_id } = commentIdSchema.parse(req.params);

  await removeLike(req.user.id, comment_id);

  res.status(200).json(build_response(true, 'Removed comment like successfully!', null));
});

// POST /api/v1/comment/:comment_id/reply
export const replyComment = controllerWrapper(async (req, res) => {
  const { comment_id } = commentIdSchema.parse(req.params);
  const { text, post_id } = commentSchema.parse(req.body);

  const commentDetails = await replyToComment(req.user.id, comment_id, post_id, text);

  const commentInfo = fetchCommentSchema.parse(commentDetails);
  res.status(200).json(build_response(true, 'Comment replied successfully!', null, null, commentInfo));
});
