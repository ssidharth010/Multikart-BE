export const asyncHandler = async (promise: Promise<any>): Promise<any> => {
  try {
    const result = await promise;
    return result || result?.acknowledge || result?.deletedCount
      ? [null, result._doc ?? result]
      : [null];
  } catch (err) {
    return [err];
  }
};
