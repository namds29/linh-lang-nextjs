"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
const Header = () => {
  const [username, setUsername] = useState("");
  const handleLogout = () => {
    localStorage.clear();
    redirect("/login");
  };
  useEffect(() => {
    localStorage.getItem("sub") &&
      setUsername(localStorage.getItem("sub") || "");
  }, []);
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
            {username}
            <span className="w-[1.9rem] h-[1.9rem] leading-[30px] bg-red-400 rounded-3xl">
              {username[0]}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleLogout()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </header>
  );
};
export default Header;
