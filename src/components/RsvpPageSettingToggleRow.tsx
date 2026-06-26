export default function RsvpPageSettingToggleRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`${className} flex items-center gap-3 shrink-0 justify-between align-center border border-muted p-3 rounded-md`}
    >
      {children}
    </div>
  );
}
