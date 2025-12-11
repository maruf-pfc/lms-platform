const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["public", "student", "instructor", "admin"],
      default: "public",
    },


    avatar: { type: String, default: null },
    bio: { type: String, default: "" },

    points: { type: Number, default: 0 }, // gamification

    enrolledCourses: [
      {
        course: { type: Schema.Types.ObjectId, ref: "Course" },
        enrolledAt: { type: Date, default: Date.now },
        completedAt: { type: Date, default: null }, // If null, active
        progress: { type: Number, default: 0 }, // Percent
        completedModules: [{ type: Schema.Types.ObjectId, ref: "Module" }], // Track individual modules
      }
    ],
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);
