import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/server/auth";
import { prisma } from "@/lib/prisma";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Resume storage is not configured." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Only PDF files are allowed." },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File is too large (max 5 MB)." },
      { status: 400 },
    );
  }

  const blob = await put(`resumes/${session.user.id}/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/pdf",
  });

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { resumeUrl: blob.url, resumeName: file.name },
    select: { resumeUrl: true, resumeName: true },
  });

  return NextResponse.json(user);
}
