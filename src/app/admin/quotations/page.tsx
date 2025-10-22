
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuotationsTable } from "@/components/quotations/quotations-table";
import { getQuotations } from "@/lib/bll/quotation-bll";
import { QuotationDialog } from "@/components/quotations/quotation-dialog";

export default async function QuotationsPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search = searchParams.search || '';
  const sortBy = searchParams.sortBy || 'Title';
  const sortOrder = searchParams.sortOrder || 'asc';

  const { quotations, total } = await getQuotations({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  });

  const pageCount = Math.ceil(total / limit);

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
      <QuotationsTable
        quotations={quotations}
        pageCount={pageCount}
      />
    </div>
  );
}
