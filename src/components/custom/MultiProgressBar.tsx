import { useEffect, useState } from "react";

type MultiProgressProps = {
  confirmed: number;
  maybe: number;
  declined: number;
  pending: number;
};

export function MultiProgressBar({
  confirmed,
  maybe,
  declined,
  pending,
}: MultiProgressProps) {
  const [widths, setWidths] = useState({
    confirmed: 0,
    maybe: 0,
    declined: 0,
    pending: 0,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setWidths({ confirmed, maybe, declined, pending });
    }, 100);

    return () => clearTimeout(timeout);
  }, [confirmed, maybe, declined, pending]);

  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className="flex h-full">
        <div
          className="bg-green-500 transition-all duration-1000 ease-out"
          style={{ width: `${widths.confirmed}%` }}
        />
        <div
          className="bg-yellow-500 transition-all duration-1000 ease-out"
          style={{ width: `${widths.maybe}%` }}
        />

        <div
          className="bg-red-500 transition-all duration-1000 ease-out"
          style={{ width: `${widths.declined}%` }}
        />
        <div
          className="bg-violet-500 transition-all duration-1000 ease-out"
          style={{ width: `${widths.pending}%` }}
        />
      </div>
    </div>
  );
}
