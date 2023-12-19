import { auth } from "@clerk/nextjs";
import * as React from "react";

import { getUserById } from "@/lib/actions/user.action";
import ProfileForm from "@/components/forms/ProfileForm";

const Page = async () => {
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  const mongoUser = await getUserById({ userId });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <ProfileForm
          clerkId={userId}
          user={JSON.stringify(mongoUser)} // stringify to send from server component to client component the plain object
        />
      </div>
    </>
  );
};

export default Page;
