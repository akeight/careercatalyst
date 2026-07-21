import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      id: "cldemo1234567890fake",
      email: "demo@example.com",
      name: "Demo AllyDev",
    },
  });

  const companies = [
    { name: "Nokia", website: "https://www.nokia.com", location: "Finland" },
    {
      name: "Google",
      website: "https://www.google.com",
      location: "Mountain View, CA",
    },
    {
      name: "Meta",
      website: "https://www.meta.com",
      location: "Menlo Park, CA",
    },
    {
      name: "Amazon",
      website: "https://www.amazon.com",
      location: "Seattle, WA",
    },
    {
      name: "Uber",
      website: "https://www.uber.com",
      location: "San Francisco, CA",
    },
    {
      name: "Microsoft",
      website: "https://www.microsoft.com",
      location: "Redmond, WA",
    },
    {
      name: "Netflix",
      website: "https://www.netflix.com",
      location: "Los Gatos, CA",
    },
    {
      name: "OpenAI",
      website: "https://www.openai.com",
      location: "Seattle, WA",
    },
    {
      name: "Salesforce",
      website: "https://www.salesforce.com",
      location: "Seattle, WA",
    },
    {
      name: "Dropbox",
      website: "https://www.dropbox.com",
      location: "Seattle, WA",
    },
    {
      name: "Snowflake",
      website: "https://www.snowflake.com",
      location: "Seattle, WA",
    },
    {
      name: "Redfin",
      website: "https://www.redfin.com",
      location: "Seattle, WA",
    },
    {
      name: "Smartsheet",
      website: "https://www.smartsheet.com",
      location: "Bellevue, WA",
    },
    {
      name: "T-Mobile",
      website: "https://www.t-mobile.com",
      location: "Bellevue, WA",
    },
  ];

  for (const company of companies) {
    await prisma.company.upsert({
      where: {
        userId_name: {
          userId: user.id,
          name: company.name,
        },
      },
      update: {},
      create: {
        name: company.name,
        website: company.website,
        location: company.location,
        userId: user.id,
      },
    });
  }
}

main()
  .then(() => {
    console.log("🌱 Seed complete.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
