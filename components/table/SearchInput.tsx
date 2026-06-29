import { Search } from "lucide-react";
import { Input } from "../ui/input";

export default function SearchInput({
  search,
  handleSearch,
}: {
  search: string;
  handleSearch: (value: string) => void;
}) {
  return (
    <div className="relative max-w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

      <Input
        placeholder="Search"
        className="pl-10 shadow-xs"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
