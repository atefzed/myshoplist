'use client'
import { ListItem as ListItemType } from '@/lib/stores/list-store'
import ToggleItemButton from '@/components/ui/toggle-item-button'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export default function ListItem({
  listId,
  item,
  onRemove
}: {
  listId: string
  item: ListItemType
  onRemove?: () => void
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-lg border transition-all hover:bg-accent/50 group">
      <ToggleItemButton
        listId={listId}
        itemId={item.id}
        checked={item.checked}
      />
      <span className="text-2xl">{item.emoji}</span>
      <span className={`flex-1 text-lg ${item.checked ? 'line-through opacity-50' : ''}`}>
        {item.text}
      </span>
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-9 w-9 text-destructive hover:text-destructive/80 invisible group-hover:visible"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
