
import { prisma } from "@/lib/prisma";

export const getUnits = async () => {
  return await prisma.unit.findMany();
};
