import prisma from "../config/prisma/prisma.js";
import { authenticator } from "otplib";

async function main() {
  const users = await prisma.user.findMany({
    where: {
      totpSecret: { not: null },
    },
    select: {
      username: true,
      email: true,
      role: true,
      totpSecret: true,
    },
  });

  console.log("==========================================");
  console.log("🔑 ACTIVE 2FA SECRETS AND CURRENT TOTP CODES");
  console.log("==========================================");

  for (const user of users) {
    const code = authenticator.generate(user.totpSecret!);
    console.log(`User: ${user.username || user.email} (${user.role})`);
    console.log(`  - 2FA Key/Secret: ${user.totpSecret}`);
    console.log(`  - Current 6-digit Code (valid for 30s): ${code}`);
    console.log("------------------------------------------");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
