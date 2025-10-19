
import { QuotationsTable } from "@/components/quotations/quotations-table";
import type { Quotation } from "@/lib/types";
import { getQuotations as fetchQuotationsFromBll } from "@/lib/bll/quotation-bll";
import { QuotationDialog, AddQuotationButton } from "@/components/quotations/quotation-dialog";

async function getQuotations(): Promise<Quotation[]> {
  try {
    return await fetchQuotationsFromBll();
  } catch (error) {
    console.error("Error fetching quotations:", error);
    return []; 
  }
}

export default async function QuotationsPage() {
  const quotations = await getQuotations();

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center">
        <div className="flex-1">
          <h1 className="font-headline text-4xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground">Manage quotations for all client sites.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
            <QuotationDialog>
                <AddQuotationButton />
            </QuotationDialog>
        </div>
      </div>
      
      <QuotationsTable data={quotations} />

    </div>
  );
}
