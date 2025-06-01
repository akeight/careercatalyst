// prisma/seed.ts
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo User",
      applications: {
        create: [
          {
            position: "Frontend Intern",
            company: "Spotify",
            status: "APPLIED",
            deadline: new Date("2025-07-01"),
          },
          {
            position: "Backend Intern",
            company: "Netflix",
            status: "INTERVIEW",
            deadline: new Date("2025-07-10"),
          },
          {
            position: "Software Engineer Intern",
            company: "Meta",
            status: "SAVED",
            deadline: new Date("2025-07-15"),
          },
          {
            position: "Cloud Engineering Intern",
            company: "Google",
            status: "APPLIED",
            deadline: new Date("2025-08-01"),
          },
          {
            position: "Product Design Intern",
            company: "Pinterest",
            status: "REJECTED",
            deadline: new Date("2025-06-20"),
          },
        ],
      },
    },
  });

  console.log("Seeded user with applications:", user);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
