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
import { upsertAgency } from "@/actions/agency";
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
      companyPhone: data?.companyPhone,
      whiteLabel: data?.whiteLabel || false,
      address: data?.address,
      city: data?.city,
      zipCode: data?.zipCode,
      state: data?.state,
      country: data?.country,
      agencyLogo: data?.agencyLogo,
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data]);

  const onSubmit = async (values: z.infer<typeof AgencyDetailsSchema>) => {
    try {
      let newUserData;
      if (!data?.id) {
        const bodyData = {
          email: values.companyEmail,
          name: values.name,
          shipping: {
            address: {
              city: values.city,
              country: values.country,
              line1: values.address,
              postal_code: values.zipCode,
              state: values.zipCode,
            },
            name: values.name,
          },
          address: {
            city: values.city,
            country: values.country,
            line1: values.address,
            postal_code: values.zipCode,
            state: values.zipCode,
          },
        };

        newUserData = await initUser({ role: "AGENCY_OWNER" });

        const response = await upsertAgency({
          id: data?.id ? data.id : v4(),
          address: values.address,
          agencyLogo: values.agencyLogo,
          city: values.city,
          companyPhone: values.companyPhone,
          country: values.country,
          name: values.name,
          state: values.state,
          whiteLabel: values.whiteLabel,
          zipCode: values.zipCode,
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
        <div className="flex justify-center flex-col gap-y-4">
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

          <div className="flex md:flex-row gap-4">
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

          <div className="flex md:flex-row gap-4">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="companyPhone"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Agency Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone" {...field} />
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
          <FormField
            disabled={isLoading}
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 st..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex md:flex-row gap-4">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Zipcpde</FormLabel>
                  <FormControl>
                    <Input placeholder="Zipcode" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            disabled={isLoading}
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
