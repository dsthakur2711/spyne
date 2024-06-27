import { COOKIE_SETTINGS } from '../../constants';
import { controllerWrapper } from '../../lib/controllerWrapper';
import build_response from '../../lib/response/MessageResponse';
import { userInfoSchema } from '../../lib/zod/common.schema';
import { passwordUpdateSchema, updateUserInfoSchema, userFollowSchema, userIdSchema, userSearchParamsSchema } from '../../lib/zod/user.schema';
import {
  addFollower,
  deleteExistingUser,
  getUserInfo,
  getUserList,
  removeFollower,
  updatePassword,
  updateUserInfo,
} from '../../services/user.service';

// POST /api/v1/user/update
export const updateUser = controllerWrapper(async (req, res) => {
  const { full_name, email, phone_number } = updateUserInfoSchema.parse(req.body);

  const userDetails = await updateUserInfo(req.user.id, full_name, email, phone_number);

  const userInfo = userInfoSchema.parse(userDetails);
  res.status(200).json(build_response(true, 'User data updated successfully!', null, null, userInfo));
});

// PATCH /api/v1/user/password
export const updateUserPassword = controllerWrapper(async (req, res) => {
  const { old_password, new_password } = passwordUpdateSchema.parse(req.body);

  await updatePassword(req.user.id, old_password, new_password);
  res.status(200).json(build_response(true, 'User password updated successfully!', null, null, null));
});

// DELETE /api/v1/user/delete
export const deleteUser = controllerWrapper(async (req, res) => {
  const { id } = userIdSchema.parse(req.user);

  await deleteExistingUser(id);

  res
    .status(204)
    .clearCookie('accessToken', COOKIE_SETTINGS)
    .clearCookie('refreshToken', COOKIE_SETTINGS)
    .json(build_response(true, 'User deleted successfully!', null, null, null));
});

// GET /api/v1/user/:id
export const getUser = controllerWrapper(async (req, res) => {
  const { id } = userIdSchema.parse(req.params);

  const user = await getUserInfo(id);

  const userInfo = userInfoSchema.parse(user);
  res.status(200).json(build_response(true, 'User fetched successfully!', null, null, userInfo));
});

// GET /api/v1/user
export const getCurrentUser = controllerWrapper(async (req, res) => {
  const userInfo = userInfoSchema.parse(req.user);
  res.status(200).json(build_response(true, 'User fetched successfully!', null, null, userInfo));
});

// POST /api/v1/user/search/:q
export const searchUsers = controllerWrapper(async (req, res) => {
  const { q, page, limit } = userSearchParamsSchema.parse(req.body);

  const { total_count, users } = await getUserList(q, page, limit);

  const userInfo = userInfoSchema.array().parse(users);
  res.status(200).json(build_response(true, 'Users fetched successfully!', null, total_count, userInfo));
});

// POST /api/v1/user/:id/follow
export const followUser = controllerWrapper(async (req, res) => {
  const { following_user_id } = userFollowSchema.parse(req.params);
  const current_user_id = req.user.id;

  await addFollower(following_user_id, current_user_id);

  res.status(200).json(build_response(true, 'Follower added successfully!', null, null, null));
});

// DELETE /api/v1/user/:id/follow
export const unFollowUser = controllerWrapper(async (req, res) => {
  const { following_user_id } = userFollowSchema.parse(req.params);
  const current_user_id = req.user.id;

  await removeFollower(following_user_id, current_user_id);
  res.status(200).json(build_response(true, 'Follower removed successfully!', null, null, null));
});
