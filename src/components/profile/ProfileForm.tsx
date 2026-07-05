"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { ProfileSchema } from "@/lib/validations/ProfileSchema";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AboutSchema = ProfileSchema.pick({
  school: true,
  major: true,
  gradYear: true,
  targetRole: true,
});
type AboutValues = z.infer<typeof AboutSchema>;

type ProfileUser = {
  school?: string | null;
  major?: string | null;
  gradYear?: number | null;
  targetRole?: string | null;
};

export function ProfileForm({ user }: { user?: ProfileUser | null }) {
  const utils = trpc.useUtils();

  const form = useForm<AboutValues>({
    resolver: zodResolver(AboutSchema),
    defaultValues: {
      school: user?.school ?? "",
      major: user?.major ?? "",
      gradYear: user?.gradYear ?? null,
      targetRole: user?.targetRole ?? "",
    },
  });

  const updateProfile = trpc.profile.updateProfile.useMutation({
    onSuccess: () => {
      utils.profile.get.invalidate();
      toast.success("Profile updated!");
    },
    onError: () => toast.error("Failed to update profile."),
  });

  const onSubmit = (values: AboutValues) => updateProfile.mutate(values);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">About you</CardTitle>
        <CardDescription>
          Tell us a bit about your background and where you&apos;re headed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. UC Berkeley"
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
                name="major"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Major</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Computer Science"
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
                name="gradYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Graduation year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        placeholder="e.g. 2027"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target role</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Software Engineering Intern"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
