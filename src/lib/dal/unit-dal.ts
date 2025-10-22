
// DAL (Data Access Layer) for Units

import { prisma } from '@/lib/prisma';

// DAL function to get all units
export async function findManyUnits() {
  return await prisma.unit.findMany();
}
