
'use server';

import { findManyUnits } from '@/lib/dal/unit-dal';
import type { Unit } from '@/lib/types';

export async function getUnits(): Promise<Unit[]> {
  const units = await findManyUnits();
  return units;
}
