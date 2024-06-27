import build_response from '../../lib/response/MessageResponse';
import { COOKIE_SETTINGS } from '../../constants';
import { controllerWrapper } from '../../lib/controllerWrapper';
import { createNewUser, validateUserCredentials } from '../../services/user.service';
import { authenticateUserSchema, registerNewUserSchema } from '../../lib/zod/user.schema';
import { userInfoSchema } from '../../lib/zod/common.schema';

// POST /api/v1/auth/register
export const registerNewUser = controllerWrapper(async (req, res) => {
  const { full_name, email, phone_number, password } = registerNewUserSchema.parse(req.body);

  const { access_token, refresh_token, userDetails } = await createNewUser(full_name, email, phone_number, password);

  const userInfo = userInfoSchema.parse(userDetails);
  res
    .status(200)
    .cookie('accessToken', access_token, COOKIE_SETTINGS)
    .cookie('refreshToken', refresh_token, COOKIE_SETTINGS)
    .json(build_response(true, 'User data created successfully!', null, null, userInfo));
});

// POST /api/v1/auth/login
export const loginUser = controllerWrapper(async (req, res) => {
  const { email, password } = authenticateUserSchema.parse(req.body);

  const { access_token, refresh_token, userDetails } = await validateUserCredentials(email, password);

  const userInfo = userInfoSchema.parse(userDetails);
  res
    .status(200)
    .cookie('accessToken', access_token, COOKIE_SETTINGS)
    .cookie('refreshToken', refresh_token, COOKIE_SETTINGS)
    .json(build_response(true, 'User logged in successfully!', null, null, userInfo));
});

//GET /api/v1/auth/logout
export const logoutUser = controllerWrapper(async (_req, res) => {
  res
    .status(200)
    .clearCookie('accessToken', COOKIE_SETTINGS)
    .clearCookie('refreshToken', COOKIE_SETTINGS)
    .json(build_response(true, 'User logged out successfully!', null, null));
});
