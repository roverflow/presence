"use client";

import { usePathname } from "next/navigation";

import { UserButton } from "@/features/auth/components/user-button";

import { MobileSidebar } from "@/components/mobile-sidebar";

const pathnameMap = {
  // tasks: {
  //   title: "My Tasks",
  //   description: "View all of your tasks here",
  // },
  projects: {
    title: "My Record Projects",
    description: "View all of your record projects here",
  },
};

const defaultMap = {
  title: "Home",
  description: "Monitor all of your information here",
};

export const Navbar = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

  const { description, title } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className="py-3 px-6 flex items-center justify-between bg-white shadow-sm border-b-1">
      <div className="navbar">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};
