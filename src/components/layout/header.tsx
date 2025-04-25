import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
const Header = () => {
  return (
    <header className="w-full h-[60px] p-2 flex justify-between items-center border-b fixed">
      <section id="header-toggle-slide">
        <div className="h-[2.5rem] w-[2.5rem]">
          <img
            className="w-full h-full"
            src="https://omweb-prod.s3.ap-southeast-1.amazonaws.com/linhlang/logo.png"
            alt="Linh Lang"
          />
        </div>
      </section>
      <section id="header-function" className="flex items-center gap-5">
        <Button variant="secondary">
          {/* <img className="w-5" src="/icon/ic-notification.svg" alt="" /> */}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="border px-3 flex gap-3 rounded items-center py-1">
            MomoLand Toys - Vùng đất đồ chơi
            <span className="w-[1.9rem] h-[1.9rem] leading-[30px] bg-red-400 rounded-3xl">
              M
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </header>
  );
};
export default Header;
