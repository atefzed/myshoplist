'use client'
import { useListStore } from '@/lib/stores/list-store'

export default function ToggleItemButton({
  listId,
  itemId,
  checked
}: {
  listId: string
  itemId: string
  checked: boolean
}) {
  const toggleItem = useListStore((state) => state.toggleItem)

  return (
    <button
      onClick={() => toggleItem(listId, itemId)}
      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
        checked 
          ? 'border-green-500 bg-green-100' 
          : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      {checked && (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 text-green-600" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  )
}
