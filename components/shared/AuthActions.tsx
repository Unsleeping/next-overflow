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
  const withImage = !withSheetClose;
  const logInBtn = (
    <Link href="/sign-in">
      <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none hover:border-light-400 dark:border-dark-400 hover:dark:border-light-400">
        {withImage && (
          <Image
            src="/assets/icons/account.svg"
            width={20}
            height={20}
            className="invert-colors lg:hidden"
            alt="login"
          />
        )}
        <span
          className={`primary-text-gradient ${
            withImage ? "max-lg:hidden" : ""
          }`}
        >
          Log In
        </span>
      </Button>
    </Link>
  );
  const signUpBtn = (
    <Link href="/sign-up">
      <Button className="small-medium light-border-2 btn-tertiary min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
        {withImage && (
          <Image
            src="/assets/icons/sign-up.svg"
            width={20}
            height={20}
            className="invert-colors lg:hidden"
            alt="signup"
          />
        )}
        <span
          className={`text-dark400_light900  ${
            withImage ? "max-lg:hidden" : ""
          }`}
        >
          Sign up
        </span>
      </Button>
    </Link>
  );
  const logOutBtn = (
    <SignOutButton>
      <Button className="flex-start border border-transparent hover:border-light-400  dark:border-transparent dark:text-light-900 hover:dark:border-light-400">
        <Image
          src="/assets/icons/logout.svg"
          width={20}
          height={20}
          className="mr-[16px] invert-0 dark:invert max-lg:mr-0"
          alt="logout"
        />
        <span className="base-medium max-lg:hidden">Logout</span>
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
