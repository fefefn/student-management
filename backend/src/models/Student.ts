import mongoose, { Schema, Document, Types } from "mongoose";
import { EMAIL_REGEX, PHONE_REGEX } from "../utils/helpers";

export const GENDERS = ["male", "female", "other"] as const;
export const STUDENT_STATUSES = ["active", "inactive", "graduated"] as const;

export type Gender = (typeof GENDERS)[number];
export type StudentStatus = (typeof STUDENT_STATUSES)[number];

export interface IStudent extends Document {
  studentId: string;
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: Date;
  address: string;
  course: Types.ObjectId;
  enrollmentDate: Date;
  status: StudentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [PHONE_REGEX, "Please provide a valid phone number"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: { values: GENDERS, message: "Gender must be male, female or other" },
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      maxlength: [300, "Address cannot exceed 300 characters"],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
      index: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: { values: STUDENT_STATUSES, message: "Status must be active, inactive or graduated" },
      default: "active",
      index: true,
    },
  },
  { timestamps: true, versionKey: false }
);


export const Student = mongoose.model<IStudent>("Student", studentSchema);
