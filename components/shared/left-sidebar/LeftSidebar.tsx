import * as React from "react";

import NavContent from "@/components/shared/NavContent";
import AuthActions from "@/components/shared/AuthActions";

const LeftSidebar = () => {
  return (
    <div className="fixed mt-[84px] min-h-screen w-fit border-r bg-light-900 px-[24px] pb-[16px] dark:border-dark-500 dark:bg-dark-500 max-sm:hidden lg:w-[266px]">
      <div className="flex h-[calc(100vh-84px-16px)] flex-col justify-between">
        <NavContent />
        <AuthActions />
      </div>
    </div>
  );
};

export default LeftSidebar;
