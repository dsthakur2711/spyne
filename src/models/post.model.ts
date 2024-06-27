import { and, count, eq, inArray, like } from 'drizzle-orm';
import databaseInstance from '../lib/db';
import { posts as Post, hashtag_mappings as HashtagMappings, hashtags as Hashtag, reactions as Reaction } from '../lib/db/schema';
import { CustomError } from '../lib/error/custom.error';

export const createPost = async (user_id: number, description: string, hashtags_ids: number[] | []) => {
  const values = {
    user_id,
    text: description,
    view_count: 0,
  };

  const newPost = await databaseInstance.transaction(async (transaction) => {
    const post = await transaction
      .insert(Post)
      .values(values)
      .returning({ id: Post.id, description: Post.text, user_id: Post.user_id, view_count: Post.view_count });

    const hashtagMappingsValues = hashtags_ids.map((hashtag_id) => ({ hashtag_id, post_id: post[0].id }));
    await transaction.insert(HashtagMappings).values(hashtagMappingsValues);
    return post[0];
  });

  return newPost;
};

export const updatePost = async (user_id: number, post_id: number, description: string, hashtags_ids: number[] | []) => {
  const post = await findPostById(post_id);
  if (!post) throw new CustomError(404, 'Update Error', 'Post not found!');
  if (post.user_id !== user_id) {
    throw new CustomError(401, 'Authentication Error', 'You are not authorized to delete this post!');
  }

  const values = {
    text: description,
  };

  const updatedPost = await databaseInstance.transaction(async (transaction) => {
    const post = await transaction
      .update(Post)
      .set(values)
      .where(eq(Post.id, post_id))
      .returning({ id: Post.id, description: Post.text, user_id: Post.user_id, view_count: Post.view_count });

    await transaction.delete(HashtagMappings).where(eq(HashtagMappings.post_id, post_id));

    const hashtagMappingsValues = hashtags_ids.map((hashtag_id) => ({ hashtag_id, post_id }));
    await transaction.insert(HashtagMappings).values(hashtagMappingsValues);

    return post;
  });

  return updatedPost[0];
};

export const findPostById = async (post_id: number, with_hashtags: boolean = false) => {
  let query = databaseInstance
    .select({ id: Post.id, description: Post.text, user_id: Post.user_id, view_count: Post.view_count })
    .from(Post)
    .where(eq(Post.id, post_id));

  if (with_hashtags) {
    query = query.leftJoin(HashtagMappings, eq(Post.id, HashtagMappings.post_id));
  }

  const post = await query;
  return post[0];
};

export const deletePost = async (user_id: number, post_id: number) => {
  const post = await findPostById(post_id);
  if (post.user_id !== user_id) {
    throw new CustomError(401, 'Authentication Error', 'You are not authorized to delete this post!');
  }

  await databaseInstance.transaction(async (transaction) => {
    await transaction.delete(HashtagMappings).where(eq(HashtagMappings.post_id, post_id));

    await transaction.delete(Post).where(eq(Post.id, post_id));
  });
};

export const likePost = async (user_id: number, post_id: number) => {
  const post = await findPostById(post_id);
  if (!post) {
    throw new CustomError(404, 'Like Error', 'Post not found!');
  }

  const isAlreadyLiked = await databaseInstance
    .select()
    .from(Reaction)
    .where(and(eq(Reaction.user_id, user_id), eq(Reaction.entity_type, 'Post'), eq(Reaction.entity_id, post_id), eq(Reaction.reaction_type, 'like')));

  if (isAlreadyLiked.length > 0) {
    throw new CustomError(400, 'Like Error', 'You have already liked this post!');
  }

  await databaseInstance.insert(Reaction).values({ user_id, entity_type: 'Post', entity_id: post_id, reaction_type: 'like' });
};

export const unLikePost = async (user_id: number, post_id: number) => {
  const isLiked = await databaseInstance
    .select()
    .from(Reaction)
    .where(and(eq(Reaction.user_id, user_id), eq(Reaction.entity_type, 'Post'), eq(Reaction.entity_id, post_id), eq(Reaction.reaction_type, 'like')));

  if (isLiked.length === 0) throw new CustomError(400, 'Like Error', 'You have not liked this post!');

  await databaseInstance
    .delete(Reaction)
    .where(and(eq(Reaction.user_id, user_id), eq(Reaction.entity_type, 'Post'), eq(Reaction.entity_id, post_id), eq(Reaction.reaction_type, 'like')));
};

export const searchPost = async (q: string = '', hashtags: string[], limit: number = 10, offset: number = 0) => {
  const posts = await databaseInstance
    .select()
    .from(Post)
    .leftJoin(HashtagMappings, eq(Post.id, HashtagMappings.post_id))
    .leftJoin(Hashtag, eq(HashtagMappings.hashtag_id, Hashtag.id))
    .where(and(like(Post.text, `%${q}%`), inArray(Hashtag.name, hashtags)))
    .limit(limit)
    .offset(offset);

  return posts;
};

export const getSearchPostsCount = async (q: string = '', hashtags: string[]) => {
  const postCount = await databaseInstance
    .select({ count: count() })
    .from(Post)
    .leftJoin(HashtagMappings, eq(Post.id, HashtagMappings.post_id))
    .leftJoin(Hashtag, eq(HashtagMappings.hashtag_id, Hashtag.id))
    .where(and(like(Post.text, `%${q}%`), inArray(Hashtag.name, hashtags)));

  return postCount[0].count;
};
