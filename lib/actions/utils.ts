interface GetVoteQueryArgs {
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  userId: string;
}

export const getDownvoteUpdateQuery = ({
  hasUpvoted,
  hasDownvoted,
  userId,
}: GetVoteQueryArgs) => {
  let updateQuery = {};
  if (hasDownvoted) {
    updateQuery = { $pull: { downvotes: userId } };
  } else if (hasUpvoted) {
    updateQuery = {
      $pull: { upvotes: userId },
      $push: { downvotes: userId },
    };
  } else {
    updateQuery = { $addToSet: { downvotes: userId } };
  }

  return updateQuery;
};

export const getUpvoteUpdateQuery = ({
  hasUpvoted,
  hasDownvoted,
  userId,
}: GetVoteQueryArgs) => {
  let updateQuery = {};
  if (hasUpvoted) {
    updateQuery = { $pull: { upvotes: userId } };
  } else if (hasDownvoted) {
    updateQuery = {
      $pull: { downvotes: userId },
      $push: { upvotes: userId },
    };
  } else {
    updateQuery = { $addToSet: { upvotes: userId } };
  }

  return updateQuery;
};

export const getJoinedDate = (joinedAt: Date) => {
  const month = joinedAt.toLocaleString("default", { month: "long" });
  const year = joinedAt.getFullYear();
  const joinedDate = `${month} ${year}`;
  return joinedDate;
};
