import prisma from "../config/prisma/prisma.js";

async function main() {
  const users = await prisma.user.findMany();
  console.log("--- USERS ---");
  console.log(JSON.stringify(users, null, 2));

  const openings = await prisma.opening.findMany();
  console.log("\n--- OPENINGS ---");
  console.log(`Total openings: ${openings.length}`);
  if (openings.length > 0) {
    console.log(`hiringManagerIds in openings:`, [...new Set(openings.map(o => o.hiringManagerId))]);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
