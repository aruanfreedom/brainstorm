export const resetUsersDone = (users) => {
  const result = {};

  Object.keys(users).forEach((key) => {
    result[key] = { done: false };
  });

  return result;
};
