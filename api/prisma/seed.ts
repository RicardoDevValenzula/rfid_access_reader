import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Limpia tablas dependientes antes del seed
  await prisma.accessLog.deleteMany();
  await prisma.card.deleteMany();
  await prisma.employee.deleteMany();

  const ana = await prisma.employee.create({
    data: { number: 1001, name: 'Ana López' },
  });
  const luis = await prisma.employee.create({
    data: { number: 1002, name: 'Luis Pérez' },
  });

  await prisma.card.createMany({
    data: [
      { uid: '53cbb861a10001', employeeId: ana.id },
      { uid: '53bdb861a10001', employeeId: luis.id },
    ],
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
