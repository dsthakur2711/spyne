import { inArray } from 'drizzle-orm';
import databaseInstance from '../lib/db';
import { hashtags as Hashtag } from '../lib/db/schema';

export const fetchOrCreateHashtags = async (hashtags: string[]) => {
  const values = hashtags.map((name) => ({ name }));
  await databaseInstance.insert(Hashtag).values(values).onConflictDoNothing().execute();

  const existingHashtags = await databaseInstance.select().from(Hashtag).where(inArray(Hashtag.name, hashtags));

  return existingHashtags;
};
