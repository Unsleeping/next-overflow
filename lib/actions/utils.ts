import qs from "query-string";

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

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
};

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
};
