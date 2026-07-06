"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddApplicationSchema } from "@/lib/validations/AddApplicationSchema";
import { z } from "zod";
import { trpc } from "@/lib/trpc/client";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils/utils";
import { Status } from "@prisma/client";
import { TestCombobox } from "@/components/applications/TestCombobox";
import { ContactCombobox } from "@/components/contacts/ContactCombobox";
import { toast } from "sonner";

type AddApplicationValues = z.infer<typeof AddApplicationSchema>;

const defaultValues: Partial<AddApplicationValues> = {
  title: "",
  type: "INTERNSHIP",
  location: "",
  status: "SAVED",
  source: "",
  jobUrl: "",
  notes: "",
  favorite: false,
  companyId: "",
  contactId: "",
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
      await utils.application.getFavorites.invalidate();
      await utils.application.getSaved.invalidate();
      await utils.application.getStats.invalidate();
      await utils.application.getUpcomingDeadlines.invalidate();
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

  const notesLength = form.watch("notes")?.length ?? 0;

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
          name="jobUrl"
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
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Application Deadline</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a deadline</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Markdown supported)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="- Follow up with recruiter&#10;- Copy and paste the job description&#10;- Questions about the role..."
                  className="min-h-40 resize-y"
                  maxLength={4000}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>
                  Supports Markdown: bullets, links, headings, checklists.
                </span>
                <span className="tabular-nums">{notesLength}/4000</span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactId"
          render={({ field }) => (
            <FormItem className="rounded-xl border bg-muted/20 p-4">
              <FormLabel>Helpful contact</FormLabel>
              <p className="text-sm text-muted-foreground">
                Link someone from your contacts who could help with this
                opportunity.
              </p>
              <FormControl>
                <ContactCombobox
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  companyId={form.watch("companyId")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
