import { useState } from "react";
import { Check, ChevronsUpDown, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { COUNTRIES, countryFlag } from "@/data/countries";
import { cn } from "@/lib/utils";

interface CountrySelectProps {
  value: string; // ISO 3166-1 alpha-2 code, e.g. "CD"
  onChange: (code: string) => void;
  lang: "fr" | "en" | string;
  placeholder?: string;
  className?: string;
}

/** Searchable, zero-dependency country dropdown. Stores the ISO code; displays flag + localized name. */
const CountrySelect = ({ value, onChange, lang, placeholder, className }: CountrySelectProps) => {
  const [open, setOpen] = useState(false);
  const selected = COUNTRIES.find((c) => c.code === value);
  const nameOf = (c: (typeof COUNTRIES)[number]) => (lang === "fr" ? c.fr : c.en);
  const sorted = [...COUNTRIES].sort((a, b) => nameOf(a).localeCompare(nameOf(b)));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between rounded-xl border-2 border-border bg-surface/60 font-normal hover:bg-surface/60",
            !selected && "text-muted-foreground",
            className,
          )}
        >
          <span className="flex items-center gap-2 truncate">
            {selected ? (
              <>
                <span className="text-base leading-none">{countryFlag(selected.code)}</span>
                {nameOf(selected)}
              </>
            ) : (
              <>
                <Globe2 size={15} className="opacity-60" />
                {placeholder ?? (lang === "fr" ? "Sélectionner un pays" : "Select a country")}
              </>
            )}
          </span>
          <ChevronsUpDown size={14} className="opacity-50 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}>
          <CommandInput placeholder={lang === "fr" ? "Rechercher un pays..." : "Search a country..."} />
          <CommandList>
            <CommandEmpty>{lang === "fr" ? "Aucun pays trouvé." : "No country found."}</CommandEmpty>
            <CommandGroup>
              {sorted.map((c) => (
                <CommandItem
                  key={c.code}
                  value={`${nameOf(c)} ${c.code}`}
                  onSelect={() => {
                    onChange(c.code);
                    setOpen(false);
                  }}
                >
                  <span className="text-base leading-none mr-2">{countryFlag(c.code)}</span>
                  <span className="flex-1">{nameOf(c)}</span>
                  <Check size={14} className={cn("ml-2", value === c.code ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CountrySelect;
