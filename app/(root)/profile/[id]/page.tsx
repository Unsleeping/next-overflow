import * as React from "react";
import { SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import { URLProps } from "@/types";
import { getUserInfo } from "@/lib/actions/user.action";
import { getJoinedDate } from "@/lib/actions/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileLink from "@/components/ProfileLink";
import Stats from "@/components/Stats";
import QuestionsTab from "@/components/QuestionsTab";
import AnswersTab from "@/components/AnswersTab";

const Page = async ({ params, searchParams }: URLProps) => {
  const userInfo = await getUserInfo({ userId: params.id });
  const { userId: clerkId } = auth();
  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={userInfo?.user.picture}
            alt="profile picture"
            width={140}
            height={140}
            className="rounded-full object-cover"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {userInfo.user.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{userInfo.user.username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {userInfo.user.portfolioWebsite && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  href={userInfo.user.portfolioWebsite}
                  title={"Portfolio"}
                />
              )}

              {userInfo.user.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={userInfo.user.location}
                />
              )}

              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={getJoinedDate(userInfo.user.joinedAt)}
              />
            </div>

            {userInfo.user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {userInfo.user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="maxsm:mb-5 flex justify-end max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId === userInfo.user.clerkId && (
              <Link href="/profile/edit">
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Stats
        totalQuestions={userInfo.totalQuestions}
        totalAnswers={userInfo.totalAnswers}
        badgeCounts={userInfo.badgeCounts}
        reputation={userInfo.user.reputation}
      />
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="tab-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <QuestionsTab
              clerkId={clerkId}
              userId={userInfo.user._id}
              searchParams={searchParams}
            />
          </TabsContent>
          <TabsContent value="answers">
            <AnswersTab
              clerkId={clerkId}
              userId={userInfo.user._id}
              searchParams={searchParams}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Page;
