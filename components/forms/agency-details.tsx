"use client";

import React from "react";
import { AlertDialog } from "../ui/alert-dialog";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AgencyDetailsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";

export default function AgencyDetails() {
	const form = useForm<z.infer<typeof AgencyDetailsSchema>>({
		mode: "onChange",
		resolver: zodResolver(AgencyDetailsSchema),
		defaultValues: {
			name: "",
			companyEmail: "",
			companyPhone: "",
			whiteLabel: false,
			address: "",
			city: "",
			zipCode: "",
			state: "",
			country: "",
			agencyLogo: "",
		},
	});

	return (
		<Form {...form}>
			<form>
				<div className="flex justify-center">
					<FormField
						name="agencyLogo"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Agency Logo</FormLabel>
							</FormItem>
						)}
					/>
				</div>
			</form>
		</Form>
	);
}
