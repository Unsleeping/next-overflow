import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedOut, SignedIn, SignOutButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";

interface AuthActionsProps {
  withSheetClose?: boolean;
}

interface RenderBtnHOCProps {
  withSheetClose?: boolean;
  children: React.ReactNode;
}

const RenderBtnHOC = ({ withSheetClose, children }: RenderBtnHOCProps) => {
  if (withSheetClose) {
    return <SheetClose asChild>{children}</SheetClose>;
  }
  return children;
};

const AuthActions = ({ withSheetClose }: AuthActionsProps) => {
  const logInBtn = (
    <Link href="/sign-in">
      <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none hover:border-light-400 dark:border-dark-400 hover:dark:border-light-400">
        <span className="primary-text-gradient">Log In</span>
      </Button>
    </Link>
  );
  const signUpBtn = (
    <Link href="/sign-up">
      <Button className="small-medium light-border-2 btn-tertiary min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
        <span className="text-dark400_light900">Sign Up</span>
      </Button>
    </Link>
  );
  const logOutBtn = (
    <SignOutButton>
      <Button className="flex-start border border-transparent hover:border-light-400 dark:border-dark-400 hover:dark:border-light-400">
        <Image
          src="/assets/icons/logout.svg"
          width={24}
          height={24}
          className="mr-[16px]"
          alt="logout"
        />
        <span className="base-medium">Logout</span>
      </Button>
    </SignOutButton>
  );

  return (
    <>
      <SignedOut>
        <div className="flex flex-col gap-3">
          <RenderBtnHOC withSheetClose={withSheetClose}>
            {logInBtn}
          </RenderBtnHOC>
          <RenderBtnHOC withSheetClose={withSheetClose}>
            {signUpBtn}
          </RenderBtnHOC>
        </div>
      </SignedOut>

      <SignedIn>
        <RenderBtnHOC withSheetClose={withSheetClose}>{logOutBtn}</RenderBtnHOC>
      </SignedIn>
    </>
  );
};

export default AuthActions;
