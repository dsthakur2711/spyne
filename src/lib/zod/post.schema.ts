import { z } from 'zod';

export const postSchema = z.object({
  text: z.string(),
  hashtags: z.array(z.string()).optional(),
});

export const postIdSchema = z.object({
  post_id: z.string().transform(Number),
});

export const fetchPostSchema = z.object({
  id: z.number(),
  description: z.string(),
  user_id: z.number(),
  view_count: z.number(),
});

export const postSearchParamsSchema = z.object({
  q: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
  sort_by: z.enum(['id', 'full_name', 'email', 'phone_number', 'created_at', 'updated_at']).optional(),
  order_by: z.enum(['asc', 'desc']).optional(),
});
