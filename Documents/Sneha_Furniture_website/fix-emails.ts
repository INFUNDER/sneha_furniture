import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    if (user.email !== user.email.toLowerCase()) {
      console.log(`Updating ${user.email} to ${user.email.toLowerCase()}`);
      await prisma.user.update({
        where: { id: user.id },
        data: { email: user.email.toLowerCase() }
      });
    }
  }
  console.log('Fixed email casing for all users.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
