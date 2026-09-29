import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin@1234', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ratestore.com' },
    update: {},
    create: {
      name: 'Platform Administrator',
      email: 'admin@ratestore.com',
      passwordHash,
      address: 'Platform Admin Office, Main Street',
      role: 'ADMIN',
    },
  });

  console.log(`Admin user seeded with ID: ${admin.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
