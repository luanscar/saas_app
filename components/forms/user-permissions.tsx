"use client";
import {
  AuthUserWithAgencySigebarOptionsSubAccounts,
  UserDetailsType,
  UserWithPermissionsAndSubAccounts,
} from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Switch } from "../ui/switch";
import { useEffect, useState } from "react";
import {
  changeUserPermissions,
  getAuthUserDetails,
  getUserPermissions,
} from "@/actions/user";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

import { useModal } from "@/app/providers/modal-provider";
import { Permissions, SubAccount } from "@prisma/client";
import { v4 } from "uuid";

type Props = {
  id: string | null;
  type: "agency" | "subaccount";
  userDetails?: UserDetailsType;
  userPermissions?: Permissions[] | undefined;
  subAccounts?: SubAccount[];
};

const UserPermissions = ({
  id,
  type,
  userDetails,
  subAccounts,
  userPermissions,
}: Props) => {
  const [subAccountsPermissions, setSubAccountsPermissions] =
    useState<UserWithPermissionsAndSubAccounts>();

  const [authUserData, setAuthUserData] =
    useState<AuthUserWithAgencySigebarOptionsSubAccounts | null>(null);

  const [roleState, setRoleState] = useState("");

  const { data, setClose } = useModal();

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (data.user) {
      const fetchDetails = async () => {
        const response = await getAuthUserDetails();
        if (response) setAuthUserData(response);
      };
      fetchDetails();
    }
  }, [data]);

  const onChangePermission = async (
    subAccountId: string,
    val: boolean,
    permissionsId: string | undefined
  ) => {
    if (!userDetails?.email) return;

    const response = await changeUserPermissions(
      permissionsId,
      userDetails.email,
      subAccountId,
      val
    );

    if (response) {
      toast({
        title: "Success",
        description: "The request was successfull",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not update permissions",
      });
    }
    router.refresh();
  };

  useEffect(() => {
    if (!data.user) return;
    const getPermissions = async () => {
      if (!data.user) return;
      const permission = await getUserPermissions(data.user.id);
      setSubAccountsPermissions(permission);
    };
    getPermissions();
  }, [data]);

  return (
    <>
      {userDetails?.role === "AGENCY_OWNER" && (
        <Card>
          <CardHeader>
            <CardTitle> User Permissions</CardTitle>
            <CardDescription className="mb-4">
              You can give Sub Account access to team member by turning on
              access control for each Sub Account. This is only visible to
              agency owners
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {subAccounts?.map((subAccount) => {
              const subAccountPermissionsDetails =
                subAccountsPermissions?.Permissions.find(
                  (p) => p.subAccountId === subAccount.id
                );

              return (
                <div
                  key={subAccount.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p>{subAccount.name}</p>
                  </div>
                  <Switch
                    // disabled={loadingPermissions}
                    checked={subAccountPermissionsDetails?.access}
                    onCheckedChange={(val) => {
                      if (subAccountPermissionsDetails) {
                        subAccountPermissionsDetails.access = val;
                      }
                      onChangePermission(
                        subAccount.id,
                        val,
                        subAccountPermissionsDetails?.id
                      );
                    }}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default UserPermissions;
