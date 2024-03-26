import { Prisma, Role } from "@prisma/client";
import { getAuthUserDetails, getNotificationAndUser, getUserPermissions } from "./actions/user";

export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<
  typeof getUserPermissions
>;

export type AuthUserWithAgencySigebarOptionsSubAccounts =
  Prisma.PromiseReturnType<typeof getAuthUserDetails>;



  export type NotificationWithUser =
  Prisma.PromiseReturnType<typeof getNotificationAndUser>;
