"use client";

import * as React from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "./Logo";
import NavContent from "../shared/NavContent";
import AuthActions from "../shared/AuthActions";

const MobileNav = () => {
  const { isSignedIn } = useUser();
  const navListHeightPercent = isSignedIn ? "90%" : "85%";
  const navListHeightClassname = `max-h-[${navListHeightPercent}]`;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/assets/icons/hamburger.svg"
          alt="menu"
          width={36}
          height={36}
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="background-light900_dark200 h-full border-none"
      >
        <Logo pCls="h2-bold text-dark100_light900 font-spaceGrotest" />
        <div className="flex h-[calc(100%-31.2px)] flex-col justify-between">
          <div className={`${navListHeightClassname} overflow-auto`}>
            <NavContent withSheetClose />
          </div>

          <div>
            <AuthActions withSheetClose />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
