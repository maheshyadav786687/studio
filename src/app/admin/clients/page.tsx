import { ClientsTable } from "@/components/clients/clients-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ClientDialog } from "@/components/clients/client-dialog";
import type { Client } from "@/lib/types";

async function getClients(): Promise<Client[]> {
  // In a real app, you'd fetch from your absolute URL
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/clients`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch clients');
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching clients:", error);
    return []; // Return empty array on error
  }
}

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center">
        <div className="flex-1">
          <h1 className="font-headline text-4xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your client accounts and view their information.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
            <ClientDialog>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Client
                    </span>
                </Button>
            </ClientDialog>
        </div>
      </div>
      <ClientsTable clients={clients} />
    </div>
  );
}
