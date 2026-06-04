import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";

interface ParticipantsSelectProps {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (ids: string[]) => void;
  managerId: string;
}

export function ParticipantsSelect({
  options,
  value,
  onChange,
  managerId,
}: ParticipantsSelectProps) {
  const [open, setOpen] = useState(false);

  const toggle = (id: string) => {
    if (id === managerId) return;
    if (value.includes(id)) {
      onChange(value.filter((p) => p !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const getLabel = () => {
    if (value.length === 0) return "Vyberte účastníky...";
    const names = value
      .map((id) => options.find((o) => o.value === id)?.label)
      .filter(Boolean);
    if (names.length <= 2) return names.join(", ");
    return `${names.length} účastníci`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {getLabel()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Hledat poradce..." />
          <CommandList>
            <CommandEmpty>Žádný poradce nenalezen</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isManager = option.value === managerId;
                const isSelected = value.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => toggle(option.value)}
                    disabled={isManager}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                    {isManager && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        správce
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
