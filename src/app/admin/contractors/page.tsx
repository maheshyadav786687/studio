import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ContractorsTable } from "@/components/contractors/contractors-table"
import { ContractorDialog } from "@/components/contractors/contractor-dialog"

export default function ContractorsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center">
        <div className="flex-1">
          <h1 className="font-headline text-4xl font-bold tracking-tight">Contractors</h1>
          <p className="text-muted-foreground">Manage your team of skilled contractors.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ContractorDialog>
             <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Contractor
                </span>
              </Button>
          </ContractorDialog>
        </div>
      </div>
      <Card>
        <CardContent>
           <ContractorsTable />
        </CardContent>
      </Card>
    </div>
  )
}
