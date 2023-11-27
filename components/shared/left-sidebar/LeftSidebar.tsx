import * as React from "react";

import NavContent from "@/components/shared/NavContent";
import AuthActions from "@/components/shared/AuthActions";

const LeftSidebar = () => {
  return (
    <div className="fixed mt-[72px] min-h-screen w-[266px] bg-light-900 px-[24px] pb-[24px] dark:bg-dark-500 max-sm:hidden">
      <div className="flex h-[calc(100vh-88px)] flex-col justify-between ">
        <NavContent />
        <AuthActions />
      </div>
    </div>
  );
};

export default LeftSidebar;
