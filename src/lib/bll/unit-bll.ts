
// BLL (Business Logic Layer) for Units
'use server';

import { findManyUnits } from '@/lib/dal/unit-dal';

// BLL function to get all units.
export async function getUnits() {
  return await findManyUnits();
}
