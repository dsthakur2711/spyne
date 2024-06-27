import { CustomError } from '../lib/error/custom.error';
import { createFollowerMapping, removeFollowerMapping } from '../models/follower_mappings.model';
import {
  createUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  generateUserToken,
  getSearchUsersCount,
  searchUsers,
  updateUser,
  updateUserPassword,
  validUserAndPassword,
} from '../models/user.model';

export const createNewUser = async (full_name: string, email: string, phone_number: string, password: string) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new CustomError(409, 'Validation Error', 'User with this email already exists!');

  const createdUser = await createUser(full_name, email, password, phone_number);
  const { access_token, refresh_token } = await generateUserToken(createdUser);

  return { access_token, refresh_token, userDetails: createdUser };
};
export const validateUserCredentials = async (email: string, userPassword: string) => {
  const validatedUser = await validUserAndPassword(email, userPassword);
  if (!validatedUser) throw new CustomError(404, 'Validation Error', 'User not found!');

  const { access_token, refresh_token } = await generateUserToken(validatedUser);

  return { access_token, refresh_token, userDetails: validatedUser };
};

export const updateUserInfo = async (id: number, full_name: string, email: string, phone_number: string) => {
  const updatedUser = await updateUser(id, full_name, email, phone_number);
  return updatedUser;
};

export const updatePassword = async (id: number, old_password: string, new_password: string) => {
  const updatedUser = await updateUserPassword(id, old_password, new_password);
  return updatedUser;
};

export const deleteExistingUser = async (id: number) => {
  await deleteUser(id);
};

export const getUserInfo = async (id: number) => {
  const userDetails = await findUserById(id);
  return userDetails;
};

export const getUserList = async (q: string | undefined, page: number = 1, limit: number | undefined) => {
  const searchQuery = q || '';
  const pageLimit = limit || 10;
  const offset = (page - 1) * pageLimit;

  const users = await searchUsers(searchQuery, offset, pageLimit);
  const userCount = await getSearchUsersCount(searchQuery);
  return { total_count: userCount, users };
};

export const addFollower = async (following_user_id: number, current_user_id: number) => {
  await createFollowerMapping(following_user_id, current_user_id);
};

export const removeFollower = async (following_user_id: number, current_user_id: number) => {
  await removeFollowerMapping(following_user_id, current_user_id);
};
