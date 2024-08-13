export const parseIsFavourite = (isFavourite) => {
  if (typeof isFavourite === 'boolean') {
    return isFavourite;
  } else if (typeof isFavourite === 'string') {
    if (isFavourite.toLowerCase() === 'true') {
      return true;
    } else if (isFavourite.toLowerCase() === 'false') {
      return false;
    }
  }
  return undefined;
};

export const parseFilterParams = (query) => {
  const { isFavourite } = query;
  const parsedIsFavourite = parseIsFavourite(isFavourite);
  return { isFavourite: parsedIsFavourite };
};
