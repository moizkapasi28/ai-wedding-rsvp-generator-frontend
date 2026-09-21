/** The empty / nothing-found / failed-to-load block, shared by the list pages. */
export default function Notice({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border px-6 py-16 text-center">
      <h2 className="text-lg font-medium tracking-[-0.02em]">{title}</h2>
      <p className="mx-auto mt-2 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
