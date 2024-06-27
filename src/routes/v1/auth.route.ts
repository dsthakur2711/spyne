import express from 'express';
import { loginUser, logoutUser, registerNewUser } from '../../controllers/v1/auth.controller';

const authRouter = express.Router();

// POST /api/v1/auth/register
authRouter.post('/register', registerNewUser);

// POST /api/v1/auth/login
authRouter.post('/login', loginUser);

// POST /api/v1/auth/logout
authRouter.get('/logout', logoutUser);

export default authRouter;
