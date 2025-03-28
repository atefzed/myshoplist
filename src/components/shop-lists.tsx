'use client';
import { useListStore } from '@/lib/stores/list-store';
import Link from 'next/link';
import { formatDistanceToNow  } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

export default function ShoppingLists() {
  const { lists, deleteList } = useListStore();

  return (
    <div className="max-w-2xl m-auto flex flex-col gap-4 p-4">
      {Object.values(lists).map((list) => (
        <Card key={list.id} className="p-4 flex flex-row justify-between hover:bg-accent/50 transition-colors">
          <Link  href={`/list/${list.id}`}>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold">{list.title}</h2>
                <div className="text-sm text-muted-foreground">
                  <span>{list.items.length} items</span>
                  <span className="mx-2">•</span>
                  <span>{formatDistanceToNow(list.updatedAt)}</span>
                </div>
              </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteList(list.id)}
            className="text-destructive hover:text-destructive/80"
            >
            <Trash2 className="h-4 w-4" />
          </Button>
        </Card>
      ))}

      {Object.keys(lists).length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No shopping lists found. Create your first one!
        </div>
      )}
    </div>
  );
}
