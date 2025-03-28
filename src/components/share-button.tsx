"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCheck, Copy, Share2 } from "lucide-react";
import { useListStore } from "@/lib/stores/list-store";
import { serializeList } from "@/lib/utils/share";
import { useState } from "react";

export function ShareButton({ listId }: { listId: string }) {
  const { lists } = useListStore();
  const [isCopied, setIsCopied] = useState(false);
  const currentList = lists[listId];

  const generateUrl = () => {
    if (!currentList) return '';
    const serialized = serializeList(currentList);
    return `${window.location.origin}/share?data=${serialized}`;
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(generateUrl());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              value={generateUrl()}
              readOnly
              className="flex-1"
              onFocus={(e) => e.target.select()}
            />
            <Button onClick={copyUrl}>
              {isCopied ? <CheckCheck className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {isCopied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Share this link to collaborate on the list
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
