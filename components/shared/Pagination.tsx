"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { formUrlQuery } from "@/lib/actions/utils";

interface PaginationProps {
  pageNumber: number;
  isNext: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ pageNumber, isNext }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleNavigation = (direction: string) => {
    const nextPageNumber =
      direction === "next" ? pageNumber + 1 : pageNumber - 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.push(newUrl);
  };

  const canPrev = pageNumber !== 1;
  const canNext = isNext;

  if (!canNext && !canPrev) {
    return null;
  }

  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        disabled={!canPrev}
        onClick={() => handleNavigation("prev")}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
      >
        <p className="body-medium text-dark200_light800">Prev</p>
      </Button>
      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{pageNumber}</p>
      </div>
      <Button
        disabled={!canNext}
        onClick={() => handleNavigation("next")}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
      >
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
