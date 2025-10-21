
'use client';

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface SearchBarProps {
    placeholder: string;
}

export function SearchBar({ placeholder }: SearchBarProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams as any);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }

        startTransition(() => {
            replace(`${pathname}?${params.toString()}`);
        });
    }

    return (
        <Input 
            type="search" 
            placeholder={placeholder} 
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get('q') || ''}
        />
    )

}
