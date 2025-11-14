"use client";

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
} from "@tabler/icons-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function NavDocuments() {
  const { isMobile } = useSidebar();
  const [companies, setCompanies] = useState([]);
  const token = localStorage.getItem("token");

  const fetchCompanies = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/company", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setCompanies(data.companies || []);
      else toast.error(data.msg || "Failed to fetch companies");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching companies");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Clients</SidebarGroupLabel>
      <SidebarMenu>
        {companies.map((item) => (
          <SidebarMenuItem key={item.companyName}>
            <SidebarMenuButton asChild>
              <Link href={`/company/${item._id}`}>
                {/* <item.icon /> */}
                <span>{item.companyName}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className="data-[state=open]:bg-accent rounded-sm"
                >
                  <IconDots />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              {/* <DropdownMenuContent
                className="w-24 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem variant="destructive">
                  <IconTrash />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent> */}
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
