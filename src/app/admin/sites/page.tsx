
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SitesTable } from "@/components/sites/sites-table";
import type { Site } from "@/lib/types";
import { getSites as fetchSitesFromBll } from "@/lib/bll/site-bll";
import { SiteDialog } from "@/components/sites/site-dialog";

export const revalidate = 0;

async function getSites(): Promise<Site[]> {
  try {
    const { sites } = await fetchSitesFromBll();
    return sites;
  } catch (error) {
    console.error("Error fetching sites:", error);
    return []; 
  }
}

export default async function SitesPage() {
  const sites = await getSites();

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center">
        <div className="flex-1">
          <h1 className="font-headline text-4xl font-bold tracking-tight">Sites</h1>
          <p className="text-muted-foreground">Manage client sites and view their information.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
            <SiteDialog>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Site
                    </span>
                </Button>
            </SiteDialog>
        </div>
      </div>
      
      <SitesTable sites={sites} />

    </div>
  );
}
