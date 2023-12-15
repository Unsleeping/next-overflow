"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { sidebarLinks } from "@/constants";
import { SheetClose } from "@/components/ui/sheet";

interface NavContentProps {
  withSheetClose?: boolean;
  sectionCls?: string;
}

interface WrapperProps {
  children?: React.ReactNode;
}

const NavContent = ({ withSheetClose, sectionCls }: NavContentProps) => {
  const { userId } = useAuth();
  const pathname = usePathname();
  const sharedSectionClassname = "flex flex-col gap-6";
  const sectionClassname = sectionCls || "h-full pt-16";
  const Wrapper = ({ children }: WrapperProps) =>
    withSheetClose ? <SheetClose asChild>{children}</SheetClose> : children;

  return (
    <section className={`${sectionClassname} ${sharedSectionClassname}`}>
      {sidebarLinks.map(({ route, imgURL, label }) => {
        const isActive =
          (pathname.includes(route) && route.length > 1) || pathname === route;
        let resultRoute = route;
        if (route === "/profile") {
          if (userId) {
            resultRoute = `${route}/${userId}`;
          } else {
            return null;
          }
        }
        return (
          <Wrapper key={route}>
            <Link
              href={resultRoute}
              className={`${
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-dark300_light900"
              } flex items-center justify-start gap-4 bg-transparent p-4 hover:rounded-lg hover:bg-light-700 hover:dark:bg-dark-400`}
            >
              <Image
                src={imgURL}
                alt={label}
                width={20}
                height={20}
                className={`${isActive ? "" : "invert-colors"}`}
              />
              <p
                className={`${isActive ? "base-bold" : "base-medium"} ${
                  withSheetClose ? "" : "max-lg:hidden"
                }`}
              >
                {label}
              </p>
            </Link>
          </Wrapper>
        );
      })}
    </section>
  );
};

export default NavContent;
