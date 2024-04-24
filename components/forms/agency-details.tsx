"use client";

import React, { useEffect } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AgencyDetailsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";

import { Agency } from "@prisma/client";
import FileUpload from "../global/file-upload";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import { initUser } from "@/actions/user";
import { createAgency, upsertAgency } from "@/actions/agency";
import { v4 } from "uuid";
import { toast } from "sonner";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

type Props = {
  data?: Partial<Agency>;
};
export default function AgencyDetails({ data }: Props) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof AgencyDetailsSchema>>({
    mode: "onChange",
    resolver: zodResolver(AgencyDetailsSchema),
    defaultValues: {
      name: data?.name,
      companyEmail: data?.companyEmail,
      whiteLabel: data?.whiteLabel || false,
      agencyLogo: data?.agencyLogo,
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  const onSubmit = async (values: z.infer<typeof AgencyDetailsSchema>) => {
    try {
      let newUserData;
      if (data?.id || !data?.id) {
        const bodyData = {
          email: values.companyEmail,
          name: values.name,
        };

        newUserData = await initUser({ role: "AGENCY_OWNER" });

        const response = await createAgency({
          id: data?.id ? data.id : v4(),
          agencyLogo: values.agencyLogo,
          name: values.name,
          whiteLabel: values.whiteLabel,
          createdAt: new Date(),
          updatedAt: new Date(),
          companyEmail: values.companyEmail,
          connectAccountId: "",
          goal: 5,
        });

        toast({
          title: "Created Agency",
        });

        if (data?.id) return router.refresh();
        if (response) {
          return router.refresh();
        }
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not create your agency",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex justify-center flex-col gap-y-4 bg-transparent">
          <FormField
            disabled={isLoading}
            control={form.control}
            name="agencyLogo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agency Logo</FormLabel>
                <FormControl>
                  <FileUpload
                    apiEndpoint="agencyLogo"
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex md:flex-col gap-4">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Agency Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your agency name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyEmail"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Agency Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            disabled={isLoading}
            control={form.control}
            name="whiteLabel"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border gap-4 p-4">
                  <div>
                    <FormLabel>Whitelabel Agency</FormLabel>
                    <FormDescription>
                      Turning on whilelabel mode will show your agency logo to
                      all sub accounts by default. You can overwrite this
                      functionality through sub account settings.
                    </FormDescription>
                  </div>

                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />

          {/* {data?.id && (
				// Implementar depois
                // <div className="flex flex-col gap-2">
                //   <FormLabel>Create A Goal</FormLabel>
                //   <FormDescription>
                //     ✨ Create a goal for your agency. As your business grows
                //     your goals grow too so dont forget to set the bar higher!
                //   </FormDescription>
                //   <NumberInput
                //     defaultValue={data?.goal}
                //     onValueChange={async (val) => {
                //       if (!data?.id) return
                //       await updateAgencyDetails(data.id, { goal: val })
                //       await saveActivityLogsNotification({
                //         agencyId: data.id,
                //         description: `Updated the agency goal to | ${val} Sub Account`,
                //         subaccountId: undefined,
                //       })
                //       router.refresh()
                //     }}
                //     min={1}
                //     className="bg-background !border !border-input"
                //     placeholder="Sub Account Goal"
                //   />
                // </div>
              )} */}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loading /> : "Save Agency Information"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
