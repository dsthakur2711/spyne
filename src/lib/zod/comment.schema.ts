import { z } from 'zod';

export const commentSchema = z.object({
  text: z.string(),
  post_id: z.number(),
});

export const fetchCommentSchema = z.object({
  id: z.number(),
  text: z.string(),
  user_id: z.number().optional(),
  post_id: z.number(),
  parentId: z.number().optional(),
});

export const commentIdSchema = z.object({
  comment_id: z.string().transform(Number),
});
