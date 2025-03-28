"use client";
import { useListStore } from "@/lib/stores/list-store";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmojiPicker, { Categories } from "emoji-picker-react";
import ListItem from "@/components/ui/list-item";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ShareButton } from "./share-button";

export default function ShoppingList({ listId }: { listId?: string }) {
  const [currentListId, setCurrentListId] = useState<string>(listId || "");
  const { lists, createList, addItem, updateTitle, removeItem } = useListStore();
  const [text, setText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🍎");
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Initialize list on component mount
  useEffect(() => {
    if (!currentListId) {
      const newListId = createList("New Shopping List");
      setCurrentListId(newListId);
    }
  }, [createList, currentListId]);

  const currentList = lists[currentListId];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && currentListId) {
      addItem(currentListId, { emoji: selectedEmoji, text });
      setText("");
      setSelectedEmoji("🍎");
    }
  };

  return (
    <div className="max-w-2xl m-auto p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <div className="flex gap-2 items-center">
          <div className="flex gap-2 items-center w-full">
            <Input
              className="h-11 text-lg flex-1"
              value={currentList?.title || ""}
              onChange={(e) => updateTitle(currentListId, e.target.value)}
              placeholder="Untitled List"
              maxLength={100}
            />
            {currentListId && <ShareButton listId={currentListId} />}
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
            placeholder="Add item..."
            className="h-11 text-lg flex-1"
            type="text"
            maxLength={64}
          />
          
          <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="text-xl h-11 w-16 p-0"
              >
                {selectedEmoji}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-xs p-0" align="start">
              <div className="p-2">
                <EmojiPicker
                  width="100%"
                  height={400}
                  onEmojiClick={(data) => {
                    setSelectedEmoji(data.emoji);
                    setIsPickerOpen(false);
                  }}
                  previewConfig={{ defaultEmoji: "1f34e" }}
                  skinTonesDisabled={true}
                  lazyLoadEmojis={true}
                  searchPlaceholder="Search emojis"
                  categories={[
                    {
                      category: Categories.FOOD_DRINK,
                      name: "Food & Drinks",
                    },
                  ]}
                />
              </div>
            </PopoverContent>
          </Popover>

          <Button type="submit" size="lg" className="h-11">
            Add
          </Button>
        </div>
      </form>

      <div className="space-y-2">
        {currentList?.items.map((item) => (
          <ListItem
            key={item.id}
            listId={currentListId}
            item={item}
            onRemove={() => currentListId && removeItem(currentListId, item.id)}
          />
        ))}
      </div>
    </div>
  );
}
