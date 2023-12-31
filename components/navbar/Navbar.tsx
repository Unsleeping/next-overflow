import * as React from "react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import Logo from "./Logo";
import GlobalSearch from "../shared/search/GlobalSearch";

const Navbar = () => {
  return (
    <nav className="flex-between light-border background-light900_dark200 fixed z-50 max-h-[84px] w-full gap-5 border-b p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Logo />
      <GlobalSearch />
      <div className="flex-between gap-5">
        <Theme />
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#ff7000",
              },
            }}
          />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
