import { User, IUser } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { signToken } from "../utils/jwt";
import { LoginInput, RegisterInput } from "../validators/auth.validator";

export interface AuthResult {
  user: IUser;
  token: string;
}

export const registerUser = async (input: RegisterInput): Promise<AuthResult> => {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw ApiError.conflict("An account with this email already exists", [
      { field: "email", message: "Email is already registered" },
    ]);
  }

  const user = await User.create(input);
  const token = signToken({ id: user.id });
  return { user, token };
};

export const loginUser = async (input: LoginInput): Promise<AuthResult> => {
  // password has `select: false`, so we opt in here
  const user = await User.findOne({ email: input.email }).select("+password");

  if (!user || !(await user.comparePassword(input.password))) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const token = signToken({ id: user.id });
  return { user, token };
};
