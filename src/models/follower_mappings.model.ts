import { and, eq } from 'drizzle-orm';
import databaseInstance from '../lib/db';
import { follower_mappings as FollowerMappings } from '../lib/db/schema';

export const createFollowerMapping = async (follower_user_id: number, current_user_id: number) => {
  const values = {
    following_id: current_user_id,
    follower_id: follower_user_id,
  };

  const existingUser = await databaseInstance
    .select()
    .from(FollowerMappings)
    .where(and(eq(FollowerMappings.follower_id, follower_user_id), eq(FollowerMappings.following_id, current_user_id)))
    .limit(1);

  if (existingUser.length === 0) {
    await databaseInstance.insert(FollowerMappings).values(values);
  }
};

export const removeFollowerMapping = async (follower_user_id: number, current_user_id: number) => {
  await databaseInstance
    .delete(FollowerMappings)
    .where(and(eq(FollowerMappings.follower_id, follower_user_id), eq(FollowerMappings.following_id, current_user_id)));
};
