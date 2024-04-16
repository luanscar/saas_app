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
import { Role } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  id: string | null;
  type: "agency" | "subaccount";
  userDetails?: UserDetailsType;
};

const UserDetails = ({ id, type, userDetails }: Props) => {
  const [subAccountPermissions, setSubAccountsPermissions] =
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

  const form = useForm<z.infer<typeof userDataSchema>>({
    resolver: zodResolver(userDataSchema),
    mode: "onChange",
    defaultValues: {
      //@ts-ignore
      name: userDetails ? userDetails.name : data?.user?.name,
      email: userDetails ? userDetails.email : data?.user?.email,
      //@ts-ignore
      image: userDetails ? userDetails.image : data?.user?.image,
      role: userDetails?.role || data.user?.role,
    },
  });
  const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
    if (!id) return;
    if (userDetails?.email || userDetails?.id) {
      const updatedUser = await updateUser(values);
      userDetails?.Agency?.SubAccount.filter((subacc) =>
        userDetails.Agency?.SubAccount[0].Permissions.find(
          (p) => p.subAccountId === subacc.id && p.access
        )
      ).forEach(async (subaccount) => {
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Updated ${userDetails?.name} information`,
          subaccountId: subaccount.id,
        });
      });

      if (updatedUser) {
        toast({
          title: "Success",
          description: "Update User Information",
        });
        setClose();
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Oppse!",
          description: "Could not update user information",
        });
      }
    } else {
      console.log("Error could not submit");
    }
  };

  return (
    <>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile picture</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="avatar"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User full name</FormLabel>
                  <FormControl>
                    <Input required placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      readOnly={
                        userDetails?.role === "AGENCY_OWNER" ||
                        form.formState.isSubmitting
                      }
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel> User Role</FormLabel>
                  <Select
                    disabled={field.value === "AGENCY_OWNER"}
                    onValueChange={(value) => {
                      if (
                        value === "SUBACCOUNT_USER" ||
                        value === "SUBACCOUNT_GUEST"
                      ) {
                        setRoleState(
                          "You need to have subaccounts to assign Subaccount access to team members."
                        );
                      } else {
                        setRoleState("");
                      }
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
                      {(userDetails?.role === "AGENCY_OWNER" ||
                        data.user?.role === "AGENCY_OWNER") && (
                        <SelectItem value="AGENCY_OWNER">
                          Agency Owner
                        </SelectItem>
                      )}
                      <SelectItem value="SUBACCOUNT_USER">
                        Sub Account User
                      </SelectItem>
                      <SelectItem value="SUBACCOUNT_GUEST">
                        Sub Account Guest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground">{roleState}</p>
                </FormItem>
              )}
            />

            {userDetails?.role === "AGENCY_OWNER" &&
              userDetails?.Agency?.SubAccount?.map((item) => {
                const permission = item.Permissions[0];
                return (
                  <Card key={item?.id}>
                    <CardHeader>
                      <CardTitle>Accounts Permissions</CardTitle>
                      <CardDescription>
                        Manage the access permissions for each subaccount within
                        your agency.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between space-x-2">
                        <Label
                          htmlFor="necessary"
                          className="flex flex-col space-y-1"
                        >
                          <span>{item?.name}</span>
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
                    </CardContent>
                  </Card>
                );
              })}

            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Save User Details"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default UserDetails;
