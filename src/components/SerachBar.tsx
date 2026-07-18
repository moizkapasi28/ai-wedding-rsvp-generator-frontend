import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";

type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  debounceMs?: number;
};

export default function SearchBar({ placeholder, value = "", onChange, debounceMs = 500 }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (onChange && localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [localValue, onChange, debounceMs, value]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        type="text"
        placeholder={placeholder || "Search..."}
        className="pl-9"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
    </div>
  );
}
