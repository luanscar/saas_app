"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { User } from "@prisma/client";

export const initUser = async (newUser: Partial<User>) => {
  const user = await currentUser();

  if (!user) return;

  const userData = await db.user.upsert({
    where: { email: user.email as string },
    update: newUser,
    create: {
      id: user.id,
      image: user.image,
      email: user.email,
      name: `${user.name}`,
      role: newUser.role || "SUBACCOUNT_USER",
    },
  });

  return userData;
};
