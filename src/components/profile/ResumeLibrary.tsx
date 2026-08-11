"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  FileText,
  Upload,
  ExternalLink,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { useResumeUpload } from "@/hooks/useResumeUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function formatSize(bytes?: number | null) {
  if (!bytes) return null;
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

type ResumeListItem = {
  id: string;
  label: string | null;
  fileName: string;
  size: number | null;
};

export function ResumeLibrary() {
  const { data: session } = useSession();
  const isDemo = Boolean(session?.user?.isDemo);

  const utils = trpc.useUtils();
  const { data: resumes, isLoading } = trpc.resume.list.useQuery();
  const { uploadResume, uploading } = useResumeUpload();

  const inputRef = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState("");

  const [renameTarget, setRenameTarget] = useState<ResumeListItem | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ResumeListItem | null>(null);

  const invalidateApplications = async () => {
    await Promise.all([
      utils.application.getAll.invalidate(),
      utils.application.getFavorites.invalidate(),
      utils.application.getSaved.invalidate(),
      utils.application.getUpcomingDeadlines.invalidate(),
    ]);
  };

  const renameMutation = trpc.resume.updateLabel.useMutation({
    onSuccess: async () => {
      await utils.resume.list.invalidate();
      await invalidateApplications();
      toast.success("Resume renamed.");
      setRenameTarget(null);
    },
    onError: () => toast.error("Failed to rename resume."),
  });

  const deleteMutation = trpc.resume.delete.useMutation({
    onSuccess: async () => {
      await utils.resume.list.invalidate();
      await invalidateApplications();
      toast.success("Resume deleted.");
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to delete resume."),
  });

  const openResume = async (id: string) => {
    try {
      const { url } = await utils.resume.getViewUrl.fetch({ id });
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Couldn't open resume.");
    }
  };

  const handleFile = async (file: File) => {
    await uploadResume(file, label);
    setLabel("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Resumes</CardTitle>
        <CardDescription>
          Upload multiple versions of your resume (PDF, max 8 MB) and attach the
          right one to each application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing resumes */}
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ) : resumes && resumes.length > 0 ? (
          <ul className="space-y-2">
            {resumes.map((resume) => (
              <li
                key={resume.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <FileText className="size-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {resume.label || resume.fileName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {resume.fileName}
                    {formatSize(resume.size)
                      ? ` · ${formatSize(resume.size)}`
                      : ""}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => openResume(resume.id)}
                >
                  View <ExternalLink className="size-3.5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Resume actions"
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setRenameTarget(resume);
                        setRenameValue(resume.label ?? "");
                      }}
                    >
                      <Pencil className="size-4" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setDeleteTarget(resume)}
                    >
                      <Trash2 className="size-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No resumes yet. Upload one to get started.
          </p>
        )}

        {/* Upload new */}
        {isDemo ? (
          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            Resume upload is not available in demo mode.
          </div>
        ) : (
          <div className="space-y-3 rounded-lg border border-dashed p-4">
            <div className="space-y-1.5">
              <Label htmlFor="resume-label">Label (optional)</Label>
              <Input
                id="resume-label"
                placeholder="e.g. SWE, Design, Product"
                value={label}
                maxLength={60}
                onChange={(e) => setLabel(e.target.value)}
                disabled={uploading}
              />
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <Button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="size-4" />
              {uploading ? "Uploading..." : "Upload resume"}
            </Button>
          </div>
        )}
      </CardContent>

      {/* Rename dialog */}
      <Dialog
        open={Boolean(renameTarget)}
        onOpenChange={(open) => !open && setRenameTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename resume</DialogTitle>
            <DialogDescription>
              Give this resume a label so it&apos;s easy to pick per
              application.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={renameValue}
            maxLength={60}
            placeholder="e.g. SWE, Design, Product"
            onChange={(e) => setRenameValue(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameTarget(null)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                renameTarget &&
                renameMutation.mutate({
                  id: renameTarget.id,
                  label: renameValue.trim() || null,
                })
              }
              disabled={renameMutation.isPending}
            >
              {renameMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete resume?</DialogTitle>
            <DialogDescription>
              This will permanently delete{" "}
              <strong>{deleteTarget?.label || deleteTarget?.fileName}</strong>{" "}
              and detach it from any applications. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteTarget && deleteMutation.mutate({ id: deleteTarget.id })
              }
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
