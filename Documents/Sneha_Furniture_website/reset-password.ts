import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.update({
    where: { email: 'ronitmittal0@gmail.com' },
    data: { password: hashedPassword }
  });
  console.log('Password reset to admin123');
}

main().finally(() => prisma.$disconnect());
