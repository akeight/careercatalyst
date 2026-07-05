"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { FileText, Upload, ExternalLink } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ResumeUpload({
  resumeUrl,
  resumeName,
}: {
  resumeUrl?: string | null;
  resumeName?: string | null;
}) {
  const utils = trpc.useUtils();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Upload failed");
      }

      await utils.profile.get.invalidate();
      toast.success("Resume uploaded!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Resume</CardTitle>
        <CardDescription>
          Upload your resume as a PDF (max 5 MB).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {resumeUrl && (
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary/10">
              <FileText className="size-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {resumeName ?? "Resume.pdf"}
              </p>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                View <ExternalLink className="size-3" />
              </a>
            </div>
          </div>
        )}

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
          variant={resumeUrl ? "outline" : "default"}
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="size-4" />
          {uploading
            ? "Uploading..."
            : resumeUrl
              ? "Replace resume"
              : "Upload resume"}
        </Button>
      </CardContent>
    </Card>
  );
}
