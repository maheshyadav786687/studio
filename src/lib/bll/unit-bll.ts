
import * as unitDAL from "@/lib/dal/unit-dal";

export const getUnits = async () => {
  return await unitDAL.getUnits();
};
