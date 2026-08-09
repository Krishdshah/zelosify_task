import prisma from "../config/prisma/prisma.js";

async function main() {
  // Find the first registered hiring manager who logged in / registered via Keycloak
  const activeManager = await prisma.user.findFirst({
    where: {
      role: "HIRING_MANAGER",
      externalId: { not: null },
    },
  });

  if (!activeManager) {
    console.error("❌ No active registered hiring manager found in the database!");
    return;
  }

  console.log(`Found active hiring manager: ${activeManager.username || activeManager.email} (ID: ${activeManager.id})`);

  // Re-assign all seeded job openings to this hiring manager
  const result = await prisma.opening.updateMany({
    data: {
      hiringManagerId: activeManager.id,
    },
  });

  console.log(`✅ Successfully linked ${result.count} job openings to ${activeManager.username || activeManager.email}!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
