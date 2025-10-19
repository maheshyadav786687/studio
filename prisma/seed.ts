
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// This is a placeholder for the company ID. In a real application, this
// would be retrieved from the user's session or authentication context.
const COMPANY_ID = '49397632-3864-4c53-A227-2342879B5841'; // Hardcoded company ID

const units = [
  { Name: 'Square Meter', ShortCode: 'sqm' },
  { Name: 'Meter', ShortCode: 'm' },
  { Name: 'Cubic Meter', ShortCode: 'm³' },
  { Name: 'Kilogram', ShortCode: 'kg' },
  { Name: 'Litre', ShortCode: 'L' },
  { Name: 'Piece', ShortCode: 'pcs' },
  { Name: 'Lump Sum', ShortCode: 'LS' },
];

async function main() {
  for (const unit of units) {
    const existingUnit = await prisma.unit.findFirst({
      where: {
        Name: unit.Name,
        CompanyId: COMPANY_ID,
      },
    });

    if (!existingUnit) {
      await prisma.unit.create({
        data: {
          ...unit,
          CompanyId: COMPANY_ID,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
