// components/ApplicationForm.tsx
"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc/client"; // adjust this path
//import { z } from "zod";

//const formSchema = z.object({
//  position: z.string(),
//  company: z.string(),
//  status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED", "SAVED"]),
//  link: z.string().optional(),
//  notes: z.string().optional(),
//  deadline: z.string().optional(), // ISO string
//});

export default function ApplicationForm({
  userId,
  onSuccess,
}: {
  userId: string;
  onSuccess?: () => void;
}) {
  const utils = trpc.useUtils();
  const createApp = trpc.application.create.useMutation({
    onSuccess: () => {
      utils.application.getAll.invalidate();
      onSuccess?.();
    },
  });

  type Status = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED" | "SAVED";

  const [form, setForm] = useState<{
    position: string;
    company: string;
    status: Status;
    link: string;
    notes: string;
    deadline: string;
  }>({
    position: "",
    company: "",
    status: "APPLIED",
    link: "",
    notes: "",
    deadline: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createApp.mutate({
      ...form,
      deadline: form.deadline ? new Date(form.deadline) : undefined,
      userId,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 p-4 border rounded max-w-md"
    >
      <input
        name="position"
        value={form.position}
        onChange={handleChange}
        placeholder="Position"
        className="input"
      />
      <input
        name="company"
        value={form.company}
        onChange={handleChange}
        placeholder="Company"
        className="input"
      />
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="input"
      >
        <option>APPLIED</option>
        <option>INTERVIEW</option>
        <option>OFFER</option>
        <option>REJECTED</option>
        <option>SAVED</option>
      </select>
      <input
        name="link"
        value={form.link}
        onChange={handleChange}
        placeholder="Link"
        className="input"
      />
      <textarea
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder="Notes"
        className="input"
      />
      <input
        name="deadline"
        type="date"
        value={form.deadline}
        onChange={handleChange}
        className="input"
      />
      <button type="submit" className="btn btn-primary">
        Add Application
      </button>
    </form>
  );
}
