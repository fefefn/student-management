import { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      /** Set by the `protect` middleware after a valid JWT is verified. */
      user?: IUser;
    }
  }
}

export {};
