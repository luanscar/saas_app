import { auth } from "@/auth";
import { getUserById } from "@/data/user";
import { User } from "@prisma/client";

export const currentUser = async () => {
  const session = await auth();

  const user = getUserById(session?.user.id as string);

  return user;
};

export const currentRole = async () => {
  const session = await auth();

  return session?.user?.role;
};
