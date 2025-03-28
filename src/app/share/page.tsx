"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { deserializeList } from '@/lib/utils/share';
import { useListStore } from '@/lib/stores/list-store';

export default function SharePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const { addSharedList } = useListStore();

  useEffect(() => {
    const sharedData = searchParams.get('data');
    
    if (!sharedData) {
      setError('Invalid share link');
      return;
    }

    try {
      const list = deserializeList(sharedData);
      addSharedList(list);
      router.push(`/list/${list.id}`);
    } catch (err) {
      console.error('Failed to load shared list:', err);
      setError('Invalid or corrupted share data');
      router.push('/');
    }
  }, [searchParams, router, addSharedList]);

  if (error) {
    return (
      <div className="max-w-2xl m-auto p-4 text-red-500">
        {error} - Redirecting to homepage...
      </div>
    );
  }

  return (
    <div className="max-w-2xl m-auto p-4 text-center">
      Loading shared list...
    </div>
  );
}
