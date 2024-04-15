import { Prisma, Role } from "@prisma/client";
import {
  getAuthUserDetails,
  getNotificationAndUser,
  getUserDetails,
  getUserPermissions,
} from "./actions/user";
import { db } from "./lib/db";

export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<
  typeof getUserPermissions
>;

export type AuthUserWithAgencySigebarOptionsSubAccounts =
  Prisma.PromiseReturnType<typeof getAuthUserDetails>;

export type UserDetailsType = Prisma.PromiseReturnType<typeof getUserDetails>;

export type NotificationWithUser = Prisma.PromiseReturnType<
  typeof getNotificationAndUser
>;

const __getUsersWithAgencySubAccountPermissionsSidebarOptions = async (
  agencyId: string
) => {
  return await db.user.findFirst({
    where: { Agency: { id: agencyId } },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  });
};

export type UsersWithAgencySubAccountPermissionsSidebarOptions =
  Prisma.PromiseReturnType<
    typeof __getUsersWithAgencySubAccountPermissionsSidebarOptions
  >;
