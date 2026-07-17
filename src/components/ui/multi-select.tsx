import { CheckIcon, ChevronDownIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export type MultiSelectOption = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
  onScrollEnd?: () => void;
  isFetchingNextPage?: boolean;
};

export function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select options",
  className,
  id,
  "aria-invalid": ariaInvalid,
  onScrollEnd,
  isFetchingNextPage,
}: MultiSelectProps) {
  const allSelected =
    options.length > 0 && options.every((o) => value.includes(o.value));

  const handleSelectAll = () => {
    if (allSelected) {
      onValueChange([]);
    } else {
      onValueChange(options.map((o) => o.value));
    }
  };

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onValueChange(value.filter((v) => v !== optionValue));
    } else {
      onValueChange([...value, optionValue]);
    }
  };

  const handleRemoveBadge = (e: React.MouseEvent, optionValue: string) => {
    e.preventDefault();
    e.stopPropagation();
    onValueChange(value.filter((v) => v !== optionValue));
  };

  const selectedOptions = options.filter((o) => value.includes(o.value));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          id={id}
          type="button"
          aria-invalid={ariaInvalid}
          className={cn(
            "flex min-h-8 w-full flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
            "dark:bg-input/30 dark:hover:bg-input/50",
            value.length === 0 && "text-muted-foreground",
            className,
          )}
        >
          {value.length === 0 ? (
            <span className="flex-1 text-start">{placeholder}</span>
          ) : (
            <div className="flex flex-1 flex-wrap gap-1">
              {selectedOptions.map((opt) => (
                <Badge
                  key={opt.value}
                  variant="secondary"
                  className="h-auto gap-0.5 py-0 pl-2 pr-1 text-xs font-normal"
                >
                  {opt.label}
                  <span
                    role="button"
                    tabIndex={-1}
                    onMouseDown={(e) => handleRemoveBadge(e, opt.value)}
                    className="ml-0.5 cursor-pointer rounded-sm opacity-60 hover:opacity-100"
                  ></span>
                </Badge>
              ))}
            </div>
          )}
          <ChevronDownIcon className="ml-auto size-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-full min-w-(--radix-dropdown-menu-trigger-width) max-h-[300px] overflow-y-auto"
        onScroll={(e) => {
          if (!onScrollEnd) return;
          const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
          if (scrollHeight - scrollTop - clientHeight < 20) {
            onScrollEnd();
          }
        }}
      >
        {/* Select All — custom item to correctly show dash for indeterminate */}
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onClick={handleSelectAll}
          className="relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground"
        >
          <span className="pointer-events-none absolute right-2 flex items-center justify-center">
            {allSelected && <CheckIcon className="size-4" />}
          </span>
          Select All
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* Individual options */}
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={value.includes(option.value)}
            onSelect={(e) => e.preventDefault()}
            onCheckedChange={() => handleToggle(option.value)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
        {isFetchingNextPage && (
          <div className="py-2 text-center text-xs text-muted-foreground flex justify-center">
            Loading more...
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
