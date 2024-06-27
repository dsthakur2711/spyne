import { count, desc, eq, like, or } from 'drizzle-orm';
import { users as User } from '../lib/db/schema';
import databaseInstance from '../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CustomError } from '../lib/error/custom.error';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../constants';

export const findUserById = async (id: number) => {
  const user = await databaseInstance.select().from(User).where(eq(User.id, id)).limit(1);
  return user[0];
};

export const findUserByEmail = async (email: string) => {
  const user = await databaseInstance.select().from(User).where(eq(User.email, email)).limit(1);
  return user[0];
};

export const findUserByPhoneNumber = async (phone_number: string) => {
  const user = await databaseInstance.select().from(User).where(eq(User.phone_number, phone_number)).limit(1);
  return user[0];
};

export const validUserAndPassword = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new CustomError(404, 'Authentication Error', 'Invalid credentials!');

  const passwordMatch = user.encrypted_password ? bcrypt.compareSync(password, user.encrypted_password) : false;
  if (!passwordMatch) throw new CustomError(401, 'Authentication Error', 'Invalid credentials!');

  return user;
};

export const createUser = async (full_name: string, email: string, password: string, phone_number: string) => {
  const values = {
    full_name,
    email,
    phone_number,
    encrypted_password: bcrypt.hashSync(password, 10),
  };

  if (await findUserByEmail(email)) throw new CustomError(409, 'Conflict Error', 'User already exists!');

  const newUser = await databaseInstance.insert(User).values(values).returning({ id: User.id, full_name: User.full_name, email: User.email });

  return newUser[0];
};

export const updateUser = async (id: number, full_name: string, email: string, phone_number: string) => {
  const existing_email = await findUserByEmail(email);
  if (existing_email && existing_email.id !== id) throw new CustomError(409, 'Conflict Error', 'User with this email already exists!');

  const existing_phone_number = await findUserByPhoneNumber(phone_number);
  if (existing_phone_number && existing_phone_number.id !== id)
    throw new CustomError(409, 'Conflict Error', 'User with this phone number already exists!');

  const values = {
    full_name,
    email,
    phone_number,
  };

  const updatedUser = await databaseInstance
    .update(User)
    .set(values)
    .where(eq(User.id, id))
    .returning({ id: User.id, full_name: User.full_name, email: User.email });

  return updatedUser[0];
};

export const updateUserPassword = async (userId: number, old_password: string, new_password: string) => {
  const user = await findUserById(userId);
  const passwordMatch = user.encrypted_password ? bcrypt.compareSync(old_password, user.encrypted_password) : false;
  if (!passwordMatch) throw new CustomError(401, 'Authentication Error', 'Old Password is incorrect!');

  await databaseInstance
    .update(User)
    .set({ encrypted_password: bcrypt.hashSync(new_password, 10) })
    .where(eq(User.id, userId))
    .returning();

  return true;
};

export const deleteUser = async (id: number) => {
  await databaseInstance.delete(User).where(eq(User.id, id));
  return true;
};

export const searchUsers = async (q: string | null, offset: number, pageLimit: number) => {
  const users = await databaseInstance
    .select()
    .from(User)
    .where(or(like(User.full_name, `%${q}%`), like(User.email, `%${q}%`), like(User.phone_number, `%${q}%`)))
    .limit(pageLimit)
    .offset(offset)
    .orderBy(desc(User.id));

  return users;
};

export const getSearchUsersCount = async (q: string | null) => {
  const userCount = await databaseInstance
    .select({ count: count() })
    .from(User)
    .where(or(like(User.full_name, `%${q}%`), like(User.email, `%${q}%`), like(User.phone_number, `%${q}%`)));
  return userCount[0].count;
};

export const generateUserToken = async (user: any) => {
  const access_token_payload = { id: user.id, display_name: user.display_name, email: user.email, username: user.username };
  const access_token = jwt.sign(access_token_payload, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  const refresh_token = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '6h' });

  await databaseInstance.update(User).set({ access_token: access_token, refresh_token: refresh_token }).where(eq(User.id, user.id));
  return { access_token, refresh_token };
};
