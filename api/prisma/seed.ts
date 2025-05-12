import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Limpia tablas dependientes antes del seed
  await prisma.accessLog.deleteMany();
  await prisma.card.deleteMany();
  await prisma.employee.deleteMany();

  await prisma.employee.create({
    data: { number: 'azcv1001', name: 'Ana López' },
  });
  await prisma.employee.create({
    data: { number: 'afszxz1002', name: 'Luis Pérez' },
  });

  console.log('Seed listo');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
