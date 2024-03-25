import { Prisma } from "@prisma/client";
import { getAuthUserDetails, getUserPermissions } from "./actions/user";

export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<
  typeof getUserPermissions
>;

export type AuthUserWithAgencySigebarOptionsSubAccounts =
  Prisma.PromiseReturnType<typeof getAuthUserDetails>;
