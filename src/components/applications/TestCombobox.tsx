"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";

interface ComboboxProps {
  options: { label: string; value: string }[];
  value: string;
  onChangeAction: (val: string) => void;
  onCreateNew?: (val: string) => void;
  //placeholder?: string;
}

export function TestCombobox({
  options,
  value,
  onChangeAction,
  onCreateNew, // ✅ add this line
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? options.find((company) => company.value === value)?.label
            : "Select company..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder={"Search companies..."}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>No match found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((company) => (
                <CommandItem
                  key={company.label}
                  value={company.label}
                  onSelect={() => {
                    onChangeAction(company.value);
                    setOpen(false);
                  }}
                >
                  {company.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === company.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            {onCreateNew &&
              inputValue &&
              !options.some(
                (c) => c.label.toLowerCase() === inputValue.toLowerCase(),
              ) && (
                <CommandItem
                  onSelect={() => {
                    onCreateNew(inputValue);
                    setOpen(false);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add “{inputValue}”
                </CommandItem>
              )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
