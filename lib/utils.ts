import { BadgeCounts, Mode } from "@/types";
import {
  BADGE_CRITERIA,
  DARK_TINY_MCE_CONFIG,
  LIGHT_TINY_MCE_CONFIG,
} from "./../constants/index";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const makeCorrectSpelling = (
  count: number,
  singularStr: string,
  pluralStr: string
) => {
  return count === 1 ? singularStr : pluralStr;
};

export const getTimestamp = (createdAt: Date): string => {
  const now = new Date();
  const timeDifference = now.getTime() - createdAt.getTime();

  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  if (timeDifference < minute) {
    const seconds = Math.round(timeDifference / 1000);
    return `${seconds} ${makeCorrectSpelling(
      seconds,
      "second",
      "seconds"
    )} ago`;
  } else if (timeDifference < hour) {
    const minutes = Math.round(timeDifference / minute);
    return `${minutes} ${makeCorrectSpelling(
      minutes,
      "minute",
      "minutes"
    )} ago`;
  } else if (timeDifference < day) {
    const hours = Math.round(timeDifference / hour);
    return `${hours} ${makeCorrectSpelling(hours, "hour", "hours")} ago`;
  } else if (timeDifference < week) {
    const days = Math.round(timeDifference / day);
    return `${days} ${makeCorrectSpelling(days, "day", "days")} ago`;
  } else if (timeDifference < month) {
    const weeks = Math.round(timeDifference / week);
    return `${weeks} ${makeCorrectSpelling(weeks, "week", "weeks")} ago`;
  } else if (timeDifference < year) {
    const months = Math.round(timeDifference / month);
    return `${months} ${makeCorrectSpelling(months, "month", "months")} ago`;
  } else {
    const years = Math.round(timeDifference / year);
    return `${years} ${makeCorrectSpelling(years, "year", "years")} ago`;
  }
};

export const formatAndDivideNumber = (num: number): string => {
  if (num >= 1000000) {
    const formattedNum = (num / 1000000).toFixed(1);
    return `${formattedNum}M`;
  } else if (num >= 1000) {
    const formattedNum = (num / 1000).toFixed(1);
    return `${formattedNum}K`;
  } else {
    return num.toString();
  }
};

export const getTinyMCEConfig = (mode: Mode) => {
  return mode === "dark" ? DARK_TINY_MCE_CONFIG : LIGHT_TINY_MCE_CONFIG;
};

type BadgeParam = {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
};

export const assignBadges = (params: BadgeParam) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgeLevels: any = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1;
      }
    });
  });

  return badgeCounts;
};
