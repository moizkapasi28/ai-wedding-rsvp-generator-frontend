import React from "react";

export default function RsvpPageSettingToggleRow({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`${className} flex items-center gap-3 shrink-0 justify-between align-center border border-muted p-3 rounded-md`}
      {...props}
    >
      {children}
    </div>
  );
}
