"use client";
import { useListStore } from "@/lib/stores/list-store";
import Logo from "./logo";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function Header() {
  const { createList } = useListStore();
  const router = useRouter();

  const createNewList = () => {
    const newList = createList("New Shopping List");
    router.push(`/list/${newList}`);
  }

  return (
    <div className="flex justify-between items-center py-8 px-4 max-w-2xl m-auto">
      <Link href="/">
        <Logo width={180} height={40} />
      </Link>
      <Button className="cursor-pointer" onClick={createNewList}>
        <Plus size={24}/>
        <span className="hidden sm:inline">New list</span>
      </Button>
    </div>
  );
}
