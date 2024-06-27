import { fetchOrCreateHashtags } from '../models/hashtag.model';
import { createPost, deletePost, findPostById, getSearchPostsCount, likePost, searchPost, unLikePost, updatePost } from '../models/post.model';

export const fetchPost = async (post_id: number) => {
  const post = await findPostById(post_id);
  return post;
};

export const createNewPost = async (user_id: number, description: string, hashtags: string[] = []) => {
  const fetched_hashtags = await fetchOrCreateHashtags(hashtags);
  const hashtags_ids = fetched_hashtags.map((hashtag) => hashtag.id) || [];

  const post = await createPost(user_id, description, hashtags_ids);
  return post;
};

export const updateExistingPost = async (user_id: number, post_id: number, description: string, hashtags: string[] = []) => {
  const fetched_hashtags = await fetchOrCreateHashtags(hashtags);
  const hashtags_ids = fetched_hashtags.map((hashtag) => hashtag.id) || [];

  const updatedPost = await updatePost(user_id, post_id, description, hashtags_ids);
  return updatedPost;
};

export const deleteExistingPost = async (user_id: number, post_id: number) => {
  await deletePost(user_id, post_id);
};

export const addLike = async (user_id: number, post_id: number) => {
  await likePost(user_id, post_id);
};

export const removeLike = async (user_id: number, post_id: number) => {
  await unLikePost(user_id, post_id);
};

export const searchPostList = async (q: string = '', hashtags: string[] = [], page: number = 1, limit: number = 10) => {
  const offset = (page - 1) * limit;

  const posts = await searchPost(q, hashtags, limit, offset);
  const postCount = await getSearchPostsCount(q, hashtags);
  const postData = parseSearchPostData(posts);
  return { total_count: postCount, postData };
};

const parseSearchPostData = (data: any[]) => {
  return data
    .map((item) => {
      const post = item.posts;
      return {
        ...post,
      };
    })
    .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));
};
