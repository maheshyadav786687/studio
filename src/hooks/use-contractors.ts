import { useState, useEffect } from 'react';
import type { Contractor } from '@/lib/types';

export function useContractors() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchContractors() {
      try {
        const response = await fetch('/api/contractors');
        if (!response.ok) {
          throw new Error('Failed to fetch contractors');
        }
        const data = await response.json();
        setContractors(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err);
        } else {
            setError(new Error('An unknown error occurred'));
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchContractors();
  }, []);

  return { contractors, isLoading, error };
}
