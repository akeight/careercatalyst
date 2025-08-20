"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddApplicationSchema } from "@/lib/validations/AddApplicationSchema";
import { z } from "zod";
import { trpc } from "@/lib/trpc/client";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Status } from "@prisma/client";
import { TestCombobox } from "@/components/applications/TestCombobox";
import { toast } from "sonner";

type AddApplicationValues = z.infer<typeof AddApplicationSchema>;

const defaultValues: Partial<AddApplicationValues> = {
  title: "",
  type: "INTERNSHIP",
  location: "",
  status: "SAVED",
  source: "",
  link: "",
  notes: "",
  favorite: false,
  companyId: "",
};

export function AddApplicationForm({
  userId,
  onSuccess,
}: {
  userId: string;
  onSuccess?: () => void;
}) {
  const form = useForm<AddApplicationValues>({
    resolver: zodResolver(AddApplicationSchema),
    defaultValues,
  });

  const [newCompanyName, setNewCompanyName] = useState("");

  const utils = trpc.useUtils();

  const createApplication = trpc.application.create.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.application.getAll.invalidate();
      onSuccess?.();
      toast.success("Internship added successfully!");
    },
    onError: () => toast.error("Failed to add internship:"),
  });

  const createCompany = trpc.company.create.useMutation({
    onSuccess: (newCompany) => {
      form.setValue("companyId", newCompany.id);
      utils.company.invalidate();
    },
  });

  const onSubmit = async (values: z.infer<typeof AddApplicationSchema>) => {
    if (!values.companyId && newCompanyName) {
      try {
        const newCo = await createCompany.mutateAsync({ name: newCompanyName });
        values.companyId = newCo.id;
      } catch (err) {
        console.error("Company failed to be added:", err);
        toast.error("Company failed to be added.");
        return;
      }
    }

    if (!values.companyId) {
      toast.error("Company missing. Please add a company.");
      return;
    }

    createApplication.mutate({
      ...values,
      userId,
      status: values.status.toUpperCase() as Uppercase<typeof values.status>,
    });
  };

  const companiesQuery = trpc.company.getAll.useQuery();

  const companies =
    companiesQuery.data?.map((company) => ({
      label: company.name,
      value: company.id,
    })) || [];

  const { data: session, status } = useSession();

  if (status === "loading") return null; // ⏳ wait for session to load

  if (!session) {
    console.error("User is not authenticated.");
    return <p>You must be logged in to submit applications.</p>;
  }

  if (!session?.user) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  <SelectItem value="FELLOWSHIP">Fellowship</SelectItem>
                  <SelectItem value="EARLY_CAREER">Early Career</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <TestCombobox
                  options={companies}
                  value={field.value || ""}
                  onChangeAction={(val) => {
                    form.setValue("companyId", val);
                    setNewCompanyName(""); // clear manual name
                  }}
                  onCreateNew={(name) => {
                    form.setValue("companyId", ""); // temporary clear
                    setNewCompanyName(name); // store to create in onSubmit
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Software Engineering Intern"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Status).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Remote, San Francisco" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source</FormLabel>
              <FormControl>
                <Input
                  placeholder="Referral, LinkedIn, Handshake..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Link</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any details you want to remember..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="referredByRecruiter"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                  <span>Referred by recruiter?</span>
                </label>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("referredByRecruiter") && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="recruiterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recruiter Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recruiter.linkedIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recruiter.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jane@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recruiter.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <PhoneInput
                      international
                      defaultCountry="US"
                      placeholder="Enter phone number"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="favorite"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                  <span>Mark as favorite</span>
                </label>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {createApplication.isPending ? "Adding..." : "Add Internship"}
        </Button>
      </form>
    </Form>
  );
}
