"use client";
import { UserDetailsType } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { changeUserPermissions, updateUser } from "@/actions/user";
import { v4 } from "uuid";
import { toast, useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import Loading from "../global/loading";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import FileUpload from "../global/file-upload";
import { Input } from "../ui/input";
import { userDataSchema } from "@/schemas";
import { saveActivityLogsNotification } from "@/actions/agency";
import { useModal } from "@/app/providers/modal-provider";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Permissions, SubAccount } from "@prisma/client";
import { json } from "stream/consumers";

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
    useState<boolean>();

  const [roleState, setRoleState] = useState("");

  const { data, setClose } = useModal();

  const { toast } = useToast();
  const router = useRouter();

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
              const subAccountPermissionsDetails = userPermissions?.find(
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
