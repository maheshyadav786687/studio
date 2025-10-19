
// DAL (Data Access Layer) for Units

import { prisma } from '@/lib/prisma';
import type { Unit } from '@/lib/types';

// DAL function to get all units
export async function findManyUnits(): Promise<Unit[]> {
  return await prisma.unit.findMany();
}
