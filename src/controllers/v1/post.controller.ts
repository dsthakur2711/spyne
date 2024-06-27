import { controllerWrapper } from '../../lib/controllerWrapper';
import build_response from '../../lib/response/MessageResponse';
import { fetchPostSchema, postIdSchema, postSchema, postSearchParamsSchema } from '../../lib/zod/post.schema';
import { addLike, createNewPost, deleteExistingPost, fetchPost, removeLike, searchPostList, updateExistingPost } from '../../services/post.service';

// POST /api/v1/post
export const createPost = controllerWrapper(async (req, res) => {
  const { text, hashtags } = postSchema.parse(req.body);

  const postDetails = await createNewPost(req.user.id, text, hashtags);

  const postInfo = fetchPostSchema.parse(postDetails);
  res.status(200).json(build_response(true, 'Post created successfully!', null, null, postInfo));
});

// PUT /api/v1/post/:post_id
export const updatePost = controllerWrapper(async (req, res) => {
  const { text, hashtags } = postSchema.parse(req.body);
  const { post_id } = postIdSchema.parse(req.params);

  const postDetails = await updateExistingPost(req.user.id, post_id, text, hashtags);

  const postInfo = fetchPostSchema.parse(postDetails);
  res.status(200).json(build_response(true, 'Post updated successfully!', null, null, postInfo));
});

// DELETE /api/v1/post/:post_id
export const deletePost = controllerWrapper(async (req, res) => {
  const { post_id } = postIdSchema.parse(req.params);

  await deleteExistingPost(req.user.id, post_id);

  res.status(200).json(build_response(true, 'Post deleted successfully!', null, null, null));
});

// GET /api/v1/post/:post_id
export const getPost = controllerWrapper(async (req, res) => {
  const { post_id } = postIdSchema.parse(req.params);

  const post = await fetchPost(post_id);

  const postInfo = await fetchPostSchema.parse(post);
  res.status(200).json(build_response(true, 'Post fetched successfully!', null, null, postInfo));
});

// POST /api/v1/post/:post_id/like
export const likePost = controllerWrapper(async (req, res) => {
  const { post_id } = postIdSchema.parse(req.params);

  await addLike(req.user.id, post_id);

  res.status(200).json(build_response(true, 'Post liked successfully!', null, null, null));
});

// DELETE /api/v1/post/:post_id/unlike
export const unLikePost = controllerWrapper(async (req, res) => {
  const { post_id } = postIdSchema.parse(req.params);

  await removeLike(req.user.id, post_id);

  res.status(200).json(build_response(true, 'Removed post like successfully!', null, null, null));
});

// POST /api/v1/post/search
export const searchPost = controllerWrapper(async (req, res) => {
  const { q, hashtags, page, limit } = postSearchParamsSchema.parse(req.body);

  const { total_count, postData } = await searchPostList(q, hashtags, page, limit);

  res.status(200).json(build_response(true, 'Posts fetched successfully!', null, total_count, postData));
});
