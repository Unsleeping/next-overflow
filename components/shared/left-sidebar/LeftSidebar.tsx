import * as React from "react";

import AuthActions from "@/components/shared/AuthActions";
import NavContent from "@/components/shared/NavContent";

const LeftSidebar = () => {
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <NavContent sectionCls="flex-1" />
      <AuthActions />
    </section>
  );
};

export default LeftSidebar;
