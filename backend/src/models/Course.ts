import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  name: string;
  description: string;
  duration: string;
  fees: number;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Course name must be at least 2 characters"],
      maxlength: [100, "Course name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    duration: {
      type: String, // e.g. "6 months", "12 weeks"
      required: [true, "Duration is required"],
      trim: true,
      maxlength: [50, "Duration cannot exceed 50 characters"],
    },
    fees: {
      type: Number,
      required: [true, "Fees are required"],
      min: [0, "Fees cannot be negative"],
    },
  },
  { timestamps: true, versionKey: false }
);


export const Course = mongoose.model<ICourse>("Course", courseSchema);
