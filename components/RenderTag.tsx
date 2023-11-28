import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface RenderTagProps {
  _id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
}

const RenderTag: React.FC<RenderTagProps> = ({
  _id,
  name,
  totalQuestions,
  showCount,
}) => {
  return (
    <Link
      href={`/tags/${_id}`}
      className="flex items-center justify-between gap-2"
    >
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border border-transparent px-4 py-2 uppercase hover:border-light-400 hover:dark:border-light-400">
        {name}
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700">
          {`${totalQuestions}+` || 0}
        </p>
      )}
    </Link>
  );
};

export default RenderTag;
