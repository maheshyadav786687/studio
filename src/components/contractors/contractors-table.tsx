'use client';
import { MoreHorizontal } from "lucide-react"
import { useContractors } from "@/hooks/use-contractors";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ContractorDialog } from "./contractor-dialog"
import { Skeleton } from "@/components/ui/skeleton";


export function ContractorsTable() {
  const { contractors, isLoading, error, mutate } = useContractors();

  if (isLoading) {
    return (
       <div className="space-y-4 mt-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-destructive text-center mt-6">Failed to load contractors.</p>
  }


  return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
              <span className="sr-only">Avatar</span>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead className="hidden md:table-cell">
              Availability
            </TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contractors.map((contractor) => (
              <TableRow key={contractor.id}>
                  <TableCell className="hidden sm:table-cell">
                      <Avatar className="h-9 w-9">
                          <AvatarImage src={contractor.avatarUrl} alt={contractor.name} data-ai-hint="person portrait" />
                          <AvatarFallback>{contractor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{contractor.name}</TableCell>
                  <TableCell>
                      <div className="flex flex-wrap gap-1">
                          {contractor.skills.slice(0, 2).map(skill => (
                              <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                          {contractor.skills.length > 2 && (
                              <Badge variant="outline">+{contractor.skills.length - 2}</Badge>
                          )}
                      </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                      <Badge variant={
                          contractor.availability === 'Available' ? 'default' :
                          contractor.availability === 'On Project' ? 'destructive' : 'secondary'
                      }
                      className={contractor.availability === 'Available' ? 'bg-green-600' : ''}
                      >
                          {contractor.availability}
                      </Badge>
                  </TableCell>
                  <TableCell>
                      <ContractorDialog contractor={contractor} onSuccess={mutate}>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                          </Button>
                      </ContractorDialog>
                  </TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
  )
}
