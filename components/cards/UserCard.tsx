import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import { getTopInteractedTags } from "@/lib/actions/tag.action";
import { Badge } from "@/components/ui/badge";
import RenderTag from "../shared/RenderTag";

interface UserCardProps {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard: React.FC<UserCardProps> = async ({ user }) => {
  const interactedTags = await getTopInteractedTags({ userId: user._id });
  return (
    <article className="background-light900_dark200 light-border shadow-light100_darknone flex w-full flex-col items-center justify-center rounded-2xl border p-8 max-xs:min-w-full xs:w-[260px]">
      <Link href={`/profile/${user.clerkId}`}>
        <Image
          src={user.picture}
          alt="user profile picture"
          width={100}
          height={100}
          className="min-h-[100px] min-w-[100px] rounded-full object-cover"
        />
      </Link>
      <div className="mt-4 text-center">
        <h3 className="h3-bold text-dark200_light900 line-clamp-1">
          {user.name}
        </h3>
        <p className="body-regular text-dark500_light500 mt-2 line-clamp-1">
          @{user.username}
        </p>
      </div>
      <div className="mt-5">
        {interactedTags.length > 0 ? (
          <div className="flex items-center gap-2">
            {interactedTags.map((tag) => (
              <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
            ))}
          </div>
        ) : (
          <Badge>No tags yer</Badge>
        )}
      </div>
    </article>
  );
};

export default UserCard;
