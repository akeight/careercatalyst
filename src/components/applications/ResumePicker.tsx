"use client";

import { useRef } from "react";
import { useSession } from "next-auth/react";
import { Upload } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { useResumeUpload } from "@/hooks/useResumeUpload";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NONE_VALUE = "__none__";

export function ResumePicker({
  value,
  onChange,
}: {
  value?: string | null;
  onChange: (id: string | null) => void;
}) {
  const { data: session } = useSession();
  const isDemo = Boolean(session?.user?.isDemo);

  const { data: resumes } = trpc.resume.list.useQuery();
  const { uploadResume, uploading } = useResumeUpload();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const created = await uploadResume(file);
    if (created) onChange(created.id);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={value ?? NONE_VALUE}
        onValueChange={(v) => onChange(v === NONE_VALUE ? null : v)}
      >
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="No resume" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE_VALUE}>No resume</SelectItem>
          {resumes?.map((resume) => (
            <SelectItem key={resume.id} value={resume.id}>
              {resume.label || resume.fileName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!isDemo && (
        <>
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
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="size-4" />
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </>
      )}
    </div>
  );
}
