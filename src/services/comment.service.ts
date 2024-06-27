import { createComment, deleteComment, findCommentById, likeComment, replyComment, unLikeComment, updateComment } from '../models/comment.model';

export const fetchComment = async (comment_id: number) => {
  const comment = await findCommentById(comment_id);
  return comment;
};

export const createNewComment = async (user_id: number, post_id: number, text: string) => {
  const comment = await createComment(user_id, post_id, text);
  return comment;
};

export const updateExistingComment = async (user_id: number, comment_id: number, text: string) => {
  const comment = await updateComment(user_id, comment_id, text);
  return comment;
};
export const deleteExistingComment = async (user_id: number, comment_id: number) => {
  await deleteComment(user_id, comment_id);
};

export const addLike = async (user_id: number, comment_id: number) => {
  await likeComment(user_id, comment_id);
};

export const removeLike = async (user_id: number, comment_id: number) => {
  await unLikeComment(user_id, comment_id);
};

export const replyToComment = async (user_id: number, comment_id: number, post_id: number, text: string) => {
  const comment = await replyComment(user_id, comment_id, post_id, text);
  return comment;
};
