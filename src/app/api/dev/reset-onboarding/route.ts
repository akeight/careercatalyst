import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/server/auth";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardedAt: null },
  });

  return NextResponse.json({ ok: true });
}
