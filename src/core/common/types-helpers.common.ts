function isStringMongoId(id: string): boolean {
  if (!id) return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export const typesHelpers = {
  isStringMongoId,
};
