// src/components/ApplicationForm.tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddApplicationSchema } from "@/lib/validations/AddApplicationSchema";
import { z } from "zod";
import { trpc } from "@/lib/trpc/client"; // or wherever your trpc utils are defined
import PhoneInput from "react-phone-number-input";

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

type AddApplicationValues = z.infer<typeof AddApplicationSchema>;

const defaultValues: Partial<AddApplicationValues> = {
  company: "",
  position: "",
  status: "SAVED",
  location: "",
  link: "",
  notes: "",
};

type ApplicationFormProps = {
  userId: string;
  onSuccess?: () => void;
};

export function ApplicationForm({ onSuccess }: ApplicationFormProps) {
  const form = useForm<AddApplicationValues>({
    resolver: zodResolver(AddApplicationSchema),
    defaultValues,
  });

  const utils = trpc.useUtils();
  const createApplication = trpc.application.create.useMutation({
    onSuccess: async () => {
      form.reset(); // clear the form
      await utils.application.invalidate(); // wait for the cache to refresh
    },
    onError: (err) => {
      console.error("Failed to create application:", err);
    },
  });

  const onSubmit = (values: AddApplicationValues) => {
    createApplication.mutate(
      {
        ...values,
        status: values.status.toUpperCase() as Uppercase<typeof values.status>,
        userId: "dev-user-id-123", // 👈 replace this with your test value
      },
      {
        onSuccess: async () => {
          form.reset();
          await utils.application.invalidate();
          if (onSuccess) onSuccess(); // 👈 close modal from parent
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Google" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Software Engineer Intern" {...field} />
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
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={Status.SAVED}>Saved</SelectItem>
                  <SelectItem value={Status.APPLIED}>Applied</SelectItem>
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
                  placeholder="Any details you want to remember…"
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
              name="recruiterLinkedIn"
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
              name="recruiterEmail"
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
              name="recruiterPhone"
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

        <Button type="submit" className="w-full">
          Add Internship
        </Button>
      </form>
    </Form>
  );
}
