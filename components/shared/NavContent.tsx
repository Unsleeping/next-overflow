"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { sidebarLinks } from "@/constants";
import { SheetClose } from "@/components/ui/sheet";

interface NavContentProps {
  withSheetClose?: boolean;
}

interface WrapperProps {
  children?: React.ReactNode;
}

const NavContent = ({ withSheetClose }: NavContentProps) => {
  const pathname = usePathname();
  return (
    <section className="flex h-full flex-col gap-6 pt-16">
      {sidebarLinks.map(({ route, imgURL, label }) => {
        const isActive =
          (pathname.includes(route) && route.length > 1) || pathname === route;
        const Wrapper = ({ children }: WrapperProps) =>
          withSheetClose ? (
            <SheetClose asChild>{children}</SheetClose>
          ) : (
            <React.Fragment>{children}</React.Fragment>
          );
        return (
          <Wrapper key={route}>
            <Link
              href={route}
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
                className={`${
                  isActive ? "base-bold" : "base-medium"
                } max-lg:hidden`}
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
