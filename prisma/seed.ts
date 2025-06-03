// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.upsert({
    where: { email: "testuser@example.com" },
    update: {},
    create: {
      email: "testuser@example.com",
      name: "Test User",
    },
  });

  // Create a company
  const company = await prisma.company.create({
    data: {
      name: "OpenAI",
      website: "https://openai.com",
      location: "San Francisco, CA",
      logoUrl: "https://openai.com/logo.png",
    },
  });

  // Create a contact (recruiter)
  const contact = await prisma.contact.create({
    data: {
      name: "Jane Recruiter",
      email: "jane@openai.com",
      phone: "555-123-4567",
      linkedIn: "https://linkedin.com/in/jane-recruiter",
      role: "Recruiter",
      companyId: company.id,
    },
  });

  // Create an application
  const application = await prisma.application.create({
    data: {
      userId: user.id,
      companyId: company.id,
      contactId: contact.id,
      type: "INTERNSHIP",
      title: "Software Engineering Intern",
      location: "Remote",
      status: "APPLIED",
      source: "LinkedIn",
      favorite: true,
    },
  });

  // Add a note
  await prisma.note.create({
    data: {
      userId: user.id,
      applicationId: application.id,
      content: "Followed up with Jane on Tuesday. Waiting to hear back.",
    },
  });

  console.log("Seed data created ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
