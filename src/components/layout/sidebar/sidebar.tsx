"use client";

import * as React from "react";
import {
  PackageSearch,
  SquareTerminal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { CompanySwitcher } from "./company-switcher";
import { NavMain } from "./nav-main";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  company: [
    {
      name: "Linh Lang Corp",
      logo: "/icon/logo.png",
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: "/icon/logo.png",
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: "/icon/logo.png",
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Sản phẩm",
      url: "#",
      icon: PackageSearch,
      isActive: true,
      items: [
        {
          title: "Banners",
          url: "/banners",
        },
        {
          title: "Tất cả sản phẩm",
          url: "/products",
        },
        {
          title: "Nhóm sản phẩm",
          url: "/products/collections",
        },
        {
          title: "Tồn kho",
          url: "#",
        },
      ],
    },
  ],
  navSale: [
    {
      title: "Website",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Blogs",
          url: "/blogs",
        },
        {
          title: "Trang nội dung",
          url: "#",
        },
        {
          title: "Menu",
          url: "/menu",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanySwitcher companies={data.company} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} groupLbl={"Platform"} />
        <NavMain items={data.navSale} groupLbl={"Kênh bán hàng"} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
