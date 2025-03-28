import ShoppingList from '@/components/shop-list'

export default async function ListPage({ params }: { params: { listId: string } }) {

  const { listId } = await params;
  if (!listId) return <div>List not found</div>

  return (
    <ShoppingList listId={listId} />
  )
}
