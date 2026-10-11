import { useEffect, useRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { COUNTRIES, countryFlag, findCountry } from "@/data/countries";
import { fieldInputClass } from "@/components/FormField";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  value: string; // full stored value, e.g. "+243 991234567"
  onChange: (value: string) => void;
  /** Country of residence (ISO code), used only as an initial suggestion for the dial code. */
  preferredCountry?: string;
  lang: "fr" | "en" | string;
}

const parseValue = (value: string): { code: string; number: string } => {
  const match = value.trim().match(/^\+(\d{1,4})\s*(.*)$/);
  if (!match) return { code: "CD", number: value.trim() };
  const dial = match[1];
  // Longest dial-code match wins (e.g. "1876" for Jamaica over plain "1").
  const found = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length).find((c) => dial.startsWith(c.dial));
  return { code: found?.code ?? "CD", number: match[2] };
};

/** Zero-dependency international phone input: country/dial-code picker + number field. */
const PhoneInput = ({ value, onChange, preferredCountry, lang }: PhoneInputProps) => {
  const [open, setOpen] = useState(false);
  const initial = parseValue(value);
  const [code, setCode] = useState(initial.code);
  const [number, setNumber] = useState(initial.number);
  const manuallyPicked = useRef(false);

  // Country-of-residence pre-fills the dial code once, but never overrides a
  // choice the user made themselves in this field.
  useEffect(() => {
    if (!preferredCountry || manuallyPicked.current || number.trim() !== "") return;
    const match = findCountry(preferredCountry);
    if (match) setCode(match.code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferredCountry]);

  const country = findCountry(code) ?? COUNTRIES[0];
  const nameOf = (c: (typeof COUNTRIES)[number]) => (lang === "fr" ? c.fr : c.en);
  const sorted = [...COUNTRIES].sort((a, b) => nameOf(a).localeCompare(nameOf(b)));

  const emit = (nextCode: string, nextNumber: string) => {
    const dial = findCountry(nextCode)?.dial ?? "";
    onChange(nextNumber.trim() ? `+${dial} ${nextNumber.trim()}` : "");
  };

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex items-center gap-1.5 px-3 text-sm rounded-xl border-2 border-border bg-surface/60 hover:bg-surface flex-shrink-0 transition-colors",
            )}
          >
            <span className="text-base leading-none">{countryFlag(country.code)}</span>
            <span className="text-muted-foreground">+{country.dial}</span>
            <ChevronsUpDown size={12} className="opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <Command filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}>
            <CommandInput placeholder={lang === "fr" ? "Rechercher..." : "Search..."} />
            <CommandList>
              <CommandEmpty>{lang === "fr" ? "Aucun résultat." : "No results."}</CommandEmpty>
              <CommandGroup>
                {sorted.map((c) => (
                  <CommandItem
                    key={c.code}
                    value={`${nameOf(c)} ${c.code} +${c.dial}`}
                    onSelect={() => {
                      manuallyPicked.current = true;
                      setCode(c.code);
                      emit(c.code, number);
                      setOpen(false);
                    }}
                  >
                    <span className="text-base leading-none mr-2">{countryFlag(c.code)}</span>
                    <span className="flex-1 truncate">{nameOf(c)}</span>
                    <span className="text-muted-foreground mr-2">+{c.dial}</span>
                    <Check size={14} className={cn(code === c.code ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        type="tel"
        inputMode="tel"
        value={number}
        onChange={(e) => {
          const next = e.target.value.replace(/[^\d\s-]/g, "");
          setNumber(next);
          emit(code, next);
        }}
        placeholder={lang === "fr" ? "Numéro de téléphone" : "Phone number"}
        maxLength={20}
        className={cn(fieldInputClass, "flex-1")}
      />
    </div>
  );
};

export default PhoneInput;
