import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_SIDEBAR } from "@/constants";
import Avtar from "react-avatar";

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative">
          <Avtar
            name="John Doe"
            size="32px"
            round={true}
            src={APP_SIDEBAR.curProfile.src}
          />
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 dark:bg-green-400 ring-sidebar ring-1"></div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-60">
        <DropdownMenuGroup>
          {APP_SIDEBAR.userMenu.itemsPrimary.map((item, index) => (
            <DropdownMenuItem key={index}>
              <item.Icon />
              <span>{item.title}</span>
              {item.kbd && (
                <DropdownMenuShortcut>{item.kbd}</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {APP_SIDEBAR.userMenu.itemsSecondary.map((item, index) => (
            <DropdownMenuItem key={index}>
              <item.Icon />
              <span>{item.title}</span>
              {item.kbd && (
                <DropdownMenuShortcut>{item.kbd}</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
