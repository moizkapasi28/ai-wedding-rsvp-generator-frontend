type ToolBarProps = {
  children?: React.ReactNode;
};

export default function ToolBar({ children }: ToolBarProps) {
  return <div className="w-full flex gap-3 items-center">{children}</div>;
}
