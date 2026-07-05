"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddApplicationSchema } from "@/lib/validations/AddApplicationSchema";
import { z } from "zod";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TestCombobox } from "@/components/applications/TestCombobox";
import { ContactCombobox } from "@/components/contacts/ContactCombobox";
import { cn } from "@/lib/utils/utils";
import { Status } from "@prisma/client";

export type EditApplicationValues = Partial<
  z.infer<typeof AddApplicationSchema>
>;

export function EditApplicationForm({
  applicationId,
  defaultValues,
  onClose,
}: {
  applicationId: string;
  defaultValues: EditApplicationValues;
  onClose: () => void;
}) {
  const form = useForm<z.infer<typeof AddApplicationSchema>>({
    resolver: zodResolver(AddApplicationSchema),
    defaultValues: {
      type: "INTERNSHIP",
      title: "",
      status: "SAVED",
      location: "",
      source: "",
      jobUrl: "",
      notes: "",
      favorite: false,
      companyId: "",
      ...defaultValues,
    },
  });

  const [newCompanyName, setNewCompanyName] = useState("");
  const utils = trpc.useUtils();

  const companiesQuery = trpc.company.getAll.useQuery();
  const companies =
    companiesQuery.data?.map((company) => ({
      label: company.name,
      value: company.id,
    })) || [];

  const createCompany = trpc.company.create.useMutation({
    onSuccess: (newCompany) => {
      form.setValue("companyId", newCompany.id);
      utils.company.invalidate();
    },
  });

  const updateApp = trpc.application.update.useMutation({
    onSuccess: () => {
      utils.application.getAll.invalidate();
      utils.application.getFavorites.invalidate();
      utils.application.getSaved.invalidate();
      utils.application.getStats.invalidate();
      utils.application.getUpcomingDeadlines.invalidate();
      toast.success("Application updated!");
      onClose();
    },
    onError: () => toast.error("Failed to update application."),
  });

  const onSubmit = async (values: z.infer<typeof AddApplicationSchema>) => {
    if (!applicationId) return;

    let companyId = values.companyId;
    if (!companyId && newCompanyName) {
      try {
        const newCo = await createCompany.mutateAsync({ name: newCompanyName });
        companyId = newCo.id;
      } catch {
        toast.error("Company failed to be added.");
        return;
      }
    }

    updateApp.mutate({
      id: applicationId,
      data: {
        type: values.type,
        title: values.title,
        status: values.status,
        location: values.location,
        source: values.source,
        jobUrl: values.jobUrl,
        notes: values.notes,
        deadline: values.deadline,
        favorite: values.favorite,
        companyId,
        contactId: values.contactId ?? "",
      },
    });
  };

  const notesLength = form.watch("notes")?.length ?? 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
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
                    setNewCompanyName("");
                  }}
                  onCreateNew={(name) => {
                    form.setValue("companyId", "");
                    setNewCompanyName(name);
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
              <Select onValueChange={field.onChange} value={field.value}>
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
                <Input
                  placeholder="e.g. Remote, San Francisco"
                  {...field}
                  value={field.value ?? ""}
                />
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
                  value={field.value ?? ""}
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
                <Input
                  placeholder="https://..."
                  {...field}
                  value={field.value ?? ""}
                />
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
                  placeholder="- Follow up with recruiter&#10;- Prep system design examples&#10;- Questions about the role..."
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
                    checked={field.value ?? false}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                  <span>Mark as favorite</span>
                </label>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={updateApp.isPending}>
          {updateApp.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
