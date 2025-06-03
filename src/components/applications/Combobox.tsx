"use client";

import { useState } from "react";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxProps {
  options: { label: string; value: string }[];
  value: string;
  onChangeAction: (val: string) => void;
  placeholder?: string;
}

export function Combobox({
  options,
  value,
  onChangeAction,
  placeholder = "Select...",
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-full px-3 py-2 border rounded text-left"
          onClick={() => setOpen(!open)}
        >
          {/* Show label for current value */}
          {options.find((opt) => opt.value === value)?.label || placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            {options.map((option, idx) => (
              <CommandItem
                key={idx}
                value={String(option.label)}
                onSelect={() => {
                  onChangeAction(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
