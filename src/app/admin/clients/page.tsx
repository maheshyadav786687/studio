
import { ClientsTable } from "@/components/clients/clients-table";
import type { Client } from "@/lib/types";
import { getClients as fetchClientsFromBll } from "@/lib/bll/client-bll";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

async function getClients(): Promise<Client[]> {
  try {
    // UIL on the server calls the BLL directly
    return await fetchClientsFromBll();
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
      </div>
      <Card>
        <CardContent className="p-6">
          <ClientsTable clients={clients} />
        </CardContent>
      </Card>
    </div>
  );
}
