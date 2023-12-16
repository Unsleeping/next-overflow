"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { deleteQuestion } from "@/lib/actions/question.action";
import { deleteAnswer } from "@/lib/actions/answer.action";
import Link from "next/link";

interface EditDeleteActionProps {
  type: "Question" | "Answer";
  itemId: string;
}

const EditDeleteAction: React.FC<EditDeleteActionProps> = ({
  type,
  itemId,
}) => {
  const pathname = usePathname();
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "Question") {
      await deleteQuestion({
        questionId: JSON.parse(itemId),
        path: pathname,
      });
    } else if (type === "Answer") {
      await deleteAnswer({
        answerId: JSON.parse(itemId),
        path: pathname,
      });
    }
  };
  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "Question" && (
        <Link href={`/question/edit/${JSON.parse(itemId)}`}>
          <Image
            src="/assets/icons/edit.svg"
            alt="edit"
            width={14}
            height={14}
            className="cursor-pointer object-contain"
          />
        </Link>
      )}
      <Image
        src="/assets/icons/trash.svg"
        alt="delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;