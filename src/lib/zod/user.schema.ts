import { z } from 'zod';
import { passwordSchema } from './common.schema';

export const registerNewUserSchema = z.object({
  full_name: z.string(),
  email: z.string(),
  password: passwordSchema,
  phone_number: z.string(),
});

export const authenticateUserSchema = z.object({
  email: z.string({
    required_error: 'Email is required.',
    invalid_type_error: 'Email must be a text.',
  }),
  password: z.string({
    required_error: 'Password is required.',
    invalid_type_error: 'Password must be a text.',
  }),
});

export const updateUserInfoSchema = z.object({
  email: z.string(),
  full_name: z.string(),
  phone_number: z.string(),
});

export const passwordUpdateSchema = z.object({
  old_password: z.string({
    required_error: 'Old password is required.',
    invalid_type_error: 'Old password must be a text.',
  }),
  new_password: passwordSchema,
});

export const userIdSchema = z.object({
  id: z.string().transform(Number),
});

export const userFollowSchema = z.object({
  following_user_id: z.string().transform(Number),
});

export const userSearchParamsSchema = z.object({
  q: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
  sort_by: z.enum(['id', 'full_name', 'email', 'phone_number', 'created_at', 'updated_at']).optional(),
  order_by: z.enum(['asc', 'desc']).optional(),
});
