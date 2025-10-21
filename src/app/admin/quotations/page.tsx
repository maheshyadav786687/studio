
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getQuotations } from "@/lib/bll/quotation-bll";
import { QuotationTable } from "@/components/quotations/quotation-table";
import { QuotationDialog } from "@/components/quotations/quotation-dialog";
import { Suspense } from "react";

export default async function QuotationsPage() {
  const quotations = await getQuotations();

  return (
    <div className="flex flex-col gap-8 p-4">
       <div className="flex items-center">
        <div className="flex-1">
          <h1 className="font-headline text-4xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground">Manage your quotations and view their information.</p>
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
      
      <Suspense fallback={<div>Loading...</div>}>
        <QuotationTable quotations={quotations} total={quotations.length} />
      </Suspense>

    </div>
  );
}
