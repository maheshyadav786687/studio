

import { getQuotations } from "@/lib/bll/quotation-bll";
import { QuotationTable } from "@/components/quotations/quotation-table";
import { PageHeader } from "@/components/ui/page-header";

export default async function QuotationsPage({
    searchParams,
  }: {
    searchParams: { [key: string]: string | string[] | undefined };
  }) {

    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 10;
    const sortBy = (searchParams.sortBy as string) || 'CreatedOn';
    const sortOrder = (searchParams.sortOrder as 'asc' | 'desc') || 'desc';
    const search = (searchParams.search as string) || '';

    const { quotations, total } = await getQuotations({page, limit, sortBy, sortOrder, search});

  return (
    <div>
        <PageHeader title="Quotations" description="Manage your quotations to clients." />
        <div className="container mx-auto py-10">
            <QuotationTable quotations={quotations} total={total} />
        </div>
    </div>
  );
}
