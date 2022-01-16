export const prepareDataFetch = (data) => {
  const result = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];
    result[key] = value;

    if (value === undefined) {
      result[key] = false;
    }
  });

  return result;
};
