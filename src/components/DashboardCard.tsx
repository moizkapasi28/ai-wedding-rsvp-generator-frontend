import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EllipsisVerticalIcon } from "lucide-react";
import { DASHBOARD_CARD_MENU } from "@/constants";

type Props = {
  title: string;
  description: string;
  text?: string;
  buttonText: string;
};

export default function DashboardCard({
  title,
  description,
  text,
  buttonText,
  children,
}: React.PropsWithChildren<Props>) {
  return (
    <Card className="bg-background">
      <CardHeader className="border-b flex justify-between">
        <div className="">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVerticalIcon size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {DASHBOARD_CARD_MENU.map((item, index) => (
              <DropdownMenuItem key={index}>
                <item.Icon />
                <span>{item.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="grid grid-cols-1 grow">{children}</CardContent>
      <CardFooter className="border-t">
        <Button variant="outline" className="ml-auto">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
