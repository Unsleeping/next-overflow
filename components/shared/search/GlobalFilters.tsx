"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { GlobalSearchFilters } from "@/constants/filters";
import { Button } from "@/components/ui/button";
import { formUrlQuery } from "@/lib/actions/utils";

const GlobalFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type");
  const [active, setActive] = React.useState(type || "");
  const handleTypeClick = (type: string) => {
    const newActive = active === type ? "" : type;
    const newQueryValue = active === type ? null : type;

    setActive(newActive);

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "type",
      value: newQueryValue,
    });

    router.push(newUrl, { scroll: false });
  };
  return (
    <div className="text-dark400_light900 paragraph-semibold flex items-center gap-5 px-5">
      <p className="text-dark400_light500 body-medium">Type: </p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((item) => (
          <Button
            key={item.value}
            type="button"
            className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize dark:text-light-800 dark:hover:text-primary-500 ${
              active === item.value
                ? "bg-primary-500 !text-light-900"
                : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500"
            }`}
            onClick={() => handleTypeClick(item.value)}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
