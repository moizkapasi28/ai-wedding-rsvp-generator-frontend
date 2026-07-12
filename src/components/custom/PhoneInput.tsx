import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";
import * as React from "react";

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
}

const COUNTRY_CODES = [
  { code: "+1", label: "US (+1)", flag: "🇺🇸" },
  { code: "+44", label: "UK (+44)", flag: "🇬🇧" },
  { code: "+91", label: "IN (+91)", flag: "🇮🇳" },
  { code: "+61", label: "AU (+61)", flag: "🇦🇺" },
  { code: "+81", label: "JP (+81)", flag: "🇯🇵" },
  { code: "+49", label: "DE (+49)", flag: "🇩🇪" },
  { code: "+33", label: "FR (+33)", flag: "🇫🇷" },
  { code: "+39", label: "IT (+39)", flag: "🇮🇹" },
  { code: "+86", label: "CN (+86)", flag: "🇨🇳" },
  { code: "+971", label: "AE (+971)", flag: "🇦🇪" },
];

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = "", onChange, ...props }, ref) => {
    // Extract country code from value, or default to +1
    const [countryCode, setCountryCode] = React.useState<string>(() => {
      const found = COUNTRY_CODES.find((c) => value.startsWith(c.code));
      return found ? found.code : "+1";
    });

    const [phoneNumber, setPhoneNumber] = React.useState<string>(() => {
      const found = COUNTRY_CODES.find((c) => value.startsWith(c.code));
      return found ? value.slice(found.code.length) : value;
    });

    // Sync from prop changes if they happen externally
    React.useEffect(() => {
      if (value) {
        const found = COUNTRY_CODES.find((c) => value.startsWith(c.code));
        if (found && found.code !== countryCode) {
          setCountryCode(found.code);
          setPhoneNumber(value.slice(found.code.length));
        } else if (!found) {
          setPhoneNumber(value); // No known country code matched
        }
      }
    }, [value, countryCode]);

    const handleCodeChange = (newCode: string) => {
      setCountryCode(newCode);
      if (onChange) onChange(`${newCode}${phoneNumber}`);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newNum = e.target.value.replace(/\D/g, ""); // only digits
      setPhoneNumber(newNum);
      if (onChange) onChange(`${countryCode}${newNum}`);
    };

    return (
      <div className="relative group">
        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10 pointer-events-none" />

        <div
          className={cn(
            "flex items-center h-9 w-full bg-white/60 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-md focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-300 shadow-sm overflow-hidden",
            className
          )}
        >
          {/* Prefix Section with Select */}
          <div className="flex items-center h-full pl-10 pr-2 border-r border-zinc-200 dark:border-zinc-800 bg-transparent">
            <Select value={countryCode} onValueChange={handleCodeChange}>
              <SelectTrigger className="h-full border-0 bg-transparent dark:bg-transparent dark:hover:bg-transparent hover:bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 px-1 w-auto min-w-[55px] text-sm font-medium text-zinc-500 dark:text-zinc-400 [&>svg]:opacity-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRY_CODES.map((c) => (
                  <SelectItem key={c.code} value={c.code} className="cursor-pointer">
                    <span className="font-medium">{c.code}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actual Input */}
          <input
            type="tel"
            ref={ref}
            value={phoneNumber}
            onChange={handleNumberChange}
            className="flex-1 h-full w-full bg-transparent px-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            {...props}
          />
        </div>
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
