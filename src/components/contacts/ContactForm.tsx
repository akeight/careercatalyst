"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import {
  ContactFormSchema,
  type ContactFormValues,
} from "@/lib/validations/ContactFormSchema";
import { ContactType, contactTypeLabels } from "@/lib/contactTypes";
import { trpc } from "@/lib/trpc/client";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TestCombobox } from "@/components/applications/TestCombobox";

export function ContactForm({
  contactId,
  defaultValues,
  onSuccess,
}: {
  contactId?: string;
  defaultValues?: Partial<ContactFormValues>;
  onSuccess?: (contact?: { id: string }) => void;
}) {
  const isEdit = Boolean(contactId);
  const [newCompanyName, setNewCompanyName] = useState("");
  const utils = trpc.useUtils();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      type: ContactType.CONNECTION,
      title: "",
      email: "",
      phone: "",
      linkedIn: "",
      notes: "",
      companyId: "",
      ...defaultValues,
    },
  });

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

  const invalidate = () => {
    utils.contact.getAll.invalidate();
  };

  const createContact = trpc.contact.create.useMutation({
    onSuccess: (contact) => {
      invalidate();
      toast.success("Contact added!");
      form.reset();
      onSuccess?.(contact);
    },
    onError: () => toast.error("Failed to add contact."),
  });

  const updateContact = trpc.contact.update.useMutation({
    onSuccess: (contact) => {
      invalidate();
      toast.success("Contact updated!");
      onSuccess?.(contact);
    },
    onError: () => toast.error("Failed to update contact."),
  });

  const onSubmit = async (values: ContactFormValues) => {
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

    const payload = { ...values, companyId: companyId ?? "" };

    if (isEdit && contactId) {
      updateContact.mutate({ id: contactId, data: payload });
    } else {
      createContact.mutate(payload);
    }
  };

  const isPending = createContact.isPending || updateContact.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  {Object.values(ContactType).map((t) => (
                    <SelectItem key={t} value={t}>
                      {contactTypeLabels[t]}
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Engineering Manager"
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
          name="companyId"
          render={() => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <TestCombobox
                  options={companies}
                  value={form.watch("companyId") || ""}
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="jane@example.com"
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
          name="phone"
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

        <FormField
          control={form.control}
          name="linkedIn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://linkedin.com/in/..."
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="How you know them, follow-ups, etc."
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending
            ? isEdit
              ? "Saving..."
              : "Adding..."
            : isEdit
              ? "Save Changes"
              : "Add Contact"}
        </Button>
      </form>
    </Form>
  );
}
