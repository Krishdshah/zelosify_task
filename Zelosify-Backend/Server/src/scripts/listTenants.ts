import prisma from "../config/prisma/prisma.js";

async function main() {
  const tenants = await prisma.tenants.findMany();
  console.log("Database Tenants:", tenants);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
