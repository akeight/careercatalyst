// components/EditInternshipModal.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditApplicationSchema } from "@/lib/validations/EditApplicationSchema";
import { z } from "zod";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";

export function EditApplicationForm({
  open,
  onClose,
  applicationId,
  defaultValues,
}: {
  open: boolean;
  onClose: () => void;
  applicationId: string;
  defaultValues: z.infer<typeof EditApplicationSchema>;
}) {
  const form = useForm<z.infer<typeof EditApplicationSchema>>({
    resolver: zodResolver(EditApplicationSchema),
    defaultValues,
  });

  const utils = trpc.useUtils();

  const updateApp = trpc.application.update.useMutation({
    onSuccess: () => {
      utils.application.getAll.invalidate();
      toast.success("Application updated!");
      onClose();
    },
    onError: () => toast.error("Failed to update."),
  });

  const onSubmit = (data: z.infer<typeof EditApplicationSchema>) => {
    if (!applicationId) return;
    updateApp.mutate({
      id: applicationId,
      data: {
        title: data.title,
        location: data.location,
        link: data.link,
        notes: data.notes,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Internship</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Software Engineering Intern"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full"></Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
