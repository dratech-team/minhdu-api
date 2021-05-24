import * as bcrypt from "bcrypt";

const SALT_ROUND = 10;

export const generateHash = async (password: string) => {
  const salt = await bcrypt.genSalt(SALT_ROUND);
  return bcrypt.hash(password, salt);
};
