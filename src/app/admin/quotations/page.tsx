
import QuotationList from "@/components/quotations/quotation-list";

export default async function QuotationsPage() {

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center">
        <div className="flex-1">
          <h1 className="font-headline text-4xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground">Manage your quotations and view their information.</p>
        </div>
      </div>
      
      <QuotationList />

    </div>
  );
}
