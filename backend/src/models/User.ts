import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import { EMAIL_REGEX } from "../utils/helpers";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [60, "Name cannot exceed 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never returned by queries unless explicitly selected
    },
  },
  { timestamps: true, versionKey: false }
);

// Hash the password before saving (only when it has been changed)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

// Never leak the password hash in JSON responses
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const { password: _password, ...safeUser } = ret;
    return safeUser;
  },
});

export const User = mongoose.model<IUser>("User", userSchema);
