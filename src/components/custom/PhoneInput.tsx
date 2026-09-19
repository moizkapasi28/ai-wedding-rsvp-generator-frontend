import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fieldBoxClass,
  fieldFocusWithinClass,
  fieldInvalidClass,
} from "@/components/ui/input";
import { cn } from "@/lib/utils";
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
      // The wrapper wears the shared field box, so this control is the same
      // height, radius and border as every other input; the ring is
      // focus-within because the focusable elements are the children.
      <div
        className={cn(
          fieldBoxClass,
          fieldFocusWithinClass,
          fieldInvalidClass,
          "flex items-center overflow-hidden",
          className
        )}
      >
        <Select value={countryCode} onValueChange={handleCodeChange}>
          <SelectTrigger className="h-full w-auto min-w-[3.75rem] rounded-none border-0 border-r border-input bg-transparent px-2.5 text-muted-foreground focus-visible:ring-0 dark:bg-transparent dark:hover:bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COUNTRY_CODES.map((c) => (
              <SelectItem key={c.code} value={c.code} className="cursor-pointer">
                {c.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <input
          type="tel"
          ref={ref}
          value={phoneNumber}
          onChange={handleNumberChange}
          className="h-full w-full flex-1 bg-transparent px-2.5 text-base outline-none placeholder:text-muted-foreground md:text-sm"
          {...props}
        />
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
