"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "../toggle";
import { Button } from "../ui/button";
import { useAuth } from "@/store/auth";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const fullname = user?.fullname || "User";
  return (
    <header className="w-full px-4 py-2 flex justify-between items-center">
      <NavigationMenu>
        <NavigationMenuList className="flex gap-4 flex-wrap">
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              data-active={pathname === "/"}
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              data-active={pathname === "/category"}
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/category">Add Categories</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              data-active={pathname === "/companies"}
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/companies">Add Companies</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-2">
        <p className="capitalize">{fullname || "User"}</p>
        <ModeToggle />
        {!user ? (
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        ) : (
          <Button
            variant="destructive"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            Logout
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
