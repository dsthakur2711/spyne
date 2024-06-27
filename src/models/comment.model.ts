import { and, eq } from 'drizzle-orm';
import databaseInstance from '../lib/db';
import { comments as Comment, reactions as Reaction } from '../lib/db/schema';
import { CustomError } from '../lib/error/custom.error';

export const createComment = async (user_id: number, post_id: number, text: string) => {
  const values = {
    user_id,
    post_id,
    text,
  };

  const comment = await databaseInstance
    .insert(Comment)
    .values(values)
    .returning({ id: Comment.id, user_id: Comment.user_id, post_id: Comment.post_id, text: Comment.text });

  return comment[0];
};

export const findCommentById = async (comment_id: number) => {
  const comment = await databaseInstance
    .select({ id: Comment.id, user_id: Comment.user_id, post_id: Comment.post_id, text: Comment.text })
    .from(Comment)
    .where(eq(Comment.id, comment_id));
  return comment[0];
};

export const updateComment = async (user_id: number, comment_id: number, text: string) => {
  const comment = await findCommentById(comment_id);
  if (!comment) throw new CustomError(404, 'Update Error', 'Comment not found!');
  if (comment.user_id !== user_id) {
    throw new CustomError(401, 'Authentication Error', 'You are not authorized to update this comment!');
  }

  const values = {
    text,
  };

  const updatedComment = await databaseInstance
    .update(Comment)
    .set(values)
    .where(eq(Comment.id, comment_id))
    .returning({ id: Comment.id, user_id: Comment.user_id, post_id: Comment.post_id, text: Comment.text });

  return updatedComment[0];
};

export const deleteComment = async (user_id: number, comment_id: number) => {
  const comment = await findCommentById(comment_id);
  if (!comment) throw new CustomError(404, 'Delete Error', 'Comment not found!');
  if (comment.user_id !== user_id) {
    throw new CustomError(401, 'Authentication Error', 'You are not authorized to delete this comment!');
  }

  await databaseInstance.delete(Comment).where(eq(Comment.id, comment_id));
};

export const likeComment = async (user_id: number, comment_id: number) => {
  const comment = await findCommentById(comment_id);
  if (!comment) throw new CustomError(404, 'Like Error', 'Comment not found!');

  const isAlreadyLiked = await databaseInstance
    .select()
    .from(Reaction)
    .where(
      and(eq(Reaction.user_id, user_id), eq(Reaction.entity_type, 'Comment'), eq(Reaction.entity_id, comment_id), eq(Reaction.reaction_type, 'like')),
    );

  if (isAlreadyLiked.length > 0) {
    throw new CustomError(400, 'Like Error', 'You have already liked this post!');
  }

  await databaseInstance.insert(Reaction).values({ user_id, entity_type: 'Comment', entity_id: comment_id, reaction_type: 'like' });
};

export const unLikeComment = async (user_id: number, comment_id: number) => {
  const isLiked = await databaseInstance
    .select()
    .from(Reaction)
    .where(
      and(eq(Reaction.user_id, user_id), eq(Reaction.entity_type, 'Comment'), eq(Reaction.entity_id, comment_id), eq(Reaction.reaction_type, 'like')),
    );

  if (isLiked.length === 0) throw new CustomError(400, 'Like Error', 'You have not liked this post!');

  await databaseInstance
    .delete(Reaction)
    .where(
      and(eq(Reaction.user_id, user_id), eq(Reaction.entity_type, 'Comment'), eq(Reaction.entity_id, comment_id), eq(Reaction.reaction_type, 'like')),
    );
};

export const replyComment = async (user_id: number, comment_id: number, post_id: number, text: string) => {
  const comment = await findCommentById(comment_id);
  if (!comment) throw new CustomError(404, 'Update Error', 'Comment not found!');
  const values = {
    user_id,
    parentId: comment_id,
    post_id,
    text,
  };

  const reply = await databaseInstance
    .insert(Comment)
    .values(values)
    .returning({ id: Comment.id, user_id: Comment.user_id, post_id: Comment.post_id, parentId: Comment.parentId, text: Comment.text });

  return reply[0];
};
