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

const LinksFormSchema = ProfileSchema.pick({
  linkedInUrl: true,
  githubUrl: true,
  portfolioUrl: true,
});
type LinksValues = z.infer<typeof LinksFormSchema>;

type ProfileLinks = {
  linkedInUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
};

export function LinksSection({ user }: { user?: ProfileLinks | null }) {
  const utils = trpc.useUtils();

  const form = useForm<LinksValues>({
    resolver: zodResolver(LinksFormSchema),
    defaultValues: {
      linkedInUrl: user?.linkedInUrl ?? "",
      githubUrl: user?.githubUrl ?? "",
      portfolioUrl: user?.portfolioUrl ?? "",
    },
  });

  const updateProfile = trpc.profile.updateProfile.useMutation({
    onSuccess: () => {
      utils.profile.get.invalidate();
      toast.success("Links updated!");
    },
    onError: () => toast.error("Failed to update links."),
  });

  const onSubmit = (values: LinksValues) => updateProfile.mutate(values);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">
          Professional links
        </CardTitle>
        <CardDescription>
          Optional. Add the profiles you want recruiters to find.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="linkedInUrl"
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
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/..."
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
              name="portfolioUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio / website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://yoursite.com"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving..." : "Save links"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
