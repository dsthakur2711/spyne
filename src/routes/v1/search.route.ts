import express from 'express';
import { searchUsers } from '../../controllers/v1/user.controller';
import { searchPost } from '../../controllers/v1/post.controller';

const searchRouter = express.Router();

// POST /api/v1/search/user
searchRouter.post('/user', searchUsers);

// POST /api/v1/search/post
searchRouter.post('/post', searchPost);

export default searchRouter;
