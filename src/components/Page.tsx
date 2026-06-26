import { useLayoutEffect } from "react";
import { useHeader } from "@/contexts/HeaderContext";

type PageHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export default function Page({ children }: { children: React.ReactNode }) {
  return <div className="px-2 py-6 md:p-3">{children}</div>;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  const { setTitle } = useHeader();

  useLayoutEffect(() => {
    setTitle(title);
    return () => {
      setTitle("");
    };
  }, [title, setTitle]);

  if (!children) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4 justify-end w-full">
      {children}
    </div>
  );
}
