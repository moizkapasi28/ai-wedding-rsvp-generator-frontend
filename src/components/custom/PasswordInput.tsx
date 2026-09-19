import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "../ui/button";
import { PasswordIndicator } from "./PasswordIndicator";

export interface PasswordInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  showTooltip?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, value = "", showTooltip = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [tooltipVisible, setTooltipVisible] = React.useState(false);

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      if (showTooltip) {
        setTooltipVisible(true);
      }
      props.onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      if (showTooltip) {
        setTooltipVisible(false);
      }
      props.onBlur?.(event);
    };

    return (
      <TooltipProvider>
        <div className="relative">
          <Tooltip open={tooltipVisible}>
            <TooltipTrigger asChild>
              <div>
                {/* Renders the shared <Input> so height, radius, focus ring and
                    invalid state match every other field. pr-9 leaves room for
                    the reveal button. */}
                <Input
                  type={showPassword ? "text" : "password"}
                  className={cn("pr-9", className)}
                  ref={ref}
                  {...props}
                  value={value}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-1 size-6 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeIcon className="size-4" />
                  ) : (
                    <EyeOffIcon className="size-4" />
                  )}
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="hidden max-w-xs md:block">
              <PasswordIndicator value={value as string} />
            </TooltipContent>
          </Tooltip>
        </div>
        {tooltipVisible && (
          <div className="mt-2 block text-sm text-muted-foreground md:hidden">
            <PasswordIndicator value={value as string} />
          </div>
        )}
      </TooltipProvider>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
