
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuotationsTable } from "@/components/quotations/quotations-table";
import type { Quotation } from "@/lib/types";
import { getQuotations as fetchQuotationsFromBll } from "@/lib/bll/quotation-bll";
import { QuotationDialog } from "@/components/quotations/quotation-dialog";

async function getQuotations(): Promise<Quotation[]> {
  try {
    // Ensure that the function returns an empty array if fetching fails or returns no data.
    const result = await fetchQuotationsFromBll({ all: true });
    return result?.quotations || [];
  } catch (error) {
    console.error("Error fetching quotations:", error);
    return []; // Explicitly return an empty array on error.
  }
}

export default async function QuotationsPage() {
  const quotations = await getQuotations();

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center">
        <div className="flex-1">
          <h1 className="font-headline text-4xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground">Manage client quotations and view their information.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
            <QuotationDialog>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Quotation
                    </span>
                </Button>
            </QuotationDialog>
        </div>
      </div>
      
      {/* Pass the quotations to the table, ensuring it's never undefined. */}
      <QuotationsTable quotations={quotations} />

    </div>
  );
}
