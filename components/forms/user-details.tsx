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
import { Permissions, SubAccount } from "@prisma/client";
import { changeUserPermissions } from "@/actions/user";
import { v4 } from "uuid";
import { toast, useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

type Props = {
  id: string | null;
  type: "agency" | "subaccount";
  userDetails?: UserDetailsType;
};

const UserDetails = ({ id, type, userDetails }: Props) => {
  const [subAccountPermissions, setSubAccountsPermissions] =
    useState<boolean>();

  const { toast } = useToast();
  const router = useRouter();

  const onChangePermission = async (
    subAccountId: string,
    val: boolean,
    permissionsId: string | undefined
  ) => {
    if (!userDetails?.email) return;

    const response = await changeUserPermissions(
      permissionsId ? permissionsId : v4(),
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
    const userPerm = userDetails?.Agency?.SubAccount[0].Permissions[0].access;
    setSubAccountsPermissions(userPerm);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cookie Settings</CardTitle>
        <CardDescription>Manage your cookie settings here.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {userDetails?.Agency?.SubAccount?.map((item) => {
          const permission = item.Permissions[0];
          return (
            <div
              key={item?.id}
              className="flex items-center justify-between space-x-2"
            >
              <Label htmlFor="necessary" className="flex flex-col space-y-1">
                <span>{item?.name}</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  These cookies are essential in order to use the website and
                  use its features.
                </span>
              </Label>
              <Switch
                checked={subAccountPermissions}
                onCheckedChange={(val) => {
                  setSubAccountsPermissions(val);
                  onChangePermission(
                    permission?.subAccountId,
                    val,
                    permission?.id
                  );
                }}
              />
            </div>
          );
        })}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Save preferences
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserDetails;
