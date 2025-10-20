
'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LayoutGrid, List } from 'lucide-react';

import { Quotation } from '@/lib/types';
import { useDebounce } from '@/hooks/use-debounce';

import { QuotationCard } from './quotation-card';
import { QuotationTable } from './quotation-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { QuotationDialog } from './quotation-dialog';

interface QuotationListProps {
  quotations: Quotation[];
  total: number;
}

export function QuotationList({ quotations, total }: QuotationListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [view, setView] = useState('card');

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const search = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(search);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useState(() => {
    if (debouncedSearchTerm !== search) {
      const params = new URLSearchParams(searchParams);
      params.set('search', debouncedSearchTerm);
      params.set('page', '1');
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearchTerm, search, pathname, router, searchParams]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
            <Input
                placeholder="Search quotations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
            />
        </div>
        <div className="flex items-center gap-2">
          <Button variant={view === 'card' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('card')}>
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button variant={view === 'table' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('table')}>
            <List className="h-5 w-5" />
          </Button>
          <QuotationDialog>
            <Button>Add Quotation</Button>
          </QuotationDialog>
        </div>
      </div>

      {view === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quotations.map(quotation => (
            <QuotationCard key={quotation.Id} quotation={quotation} />
          ))}
        </div>
      ) : (
        <QuotationTable quotations={quotations} total={total} />
      )}
    </div>
  );
}
