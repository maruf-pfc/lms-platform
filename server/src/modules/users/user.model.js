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
    headline: { type: String, default: "" },
    cv: { type: String, default: null }, // URL to CV file

    skills: [{ type: String }],
    
    experience: [{
        company: String,
        role: String,
        startDate: Date,
        endDate: Date,
        description: String,
        current: { type: Boolean, default: false }
    }],
    
    education: [{
        school: String,
        degree: String,
        fieldOfStudy: String,
        startDate: Date,
        endDate: Date,
        description: String
    }],

    socialLinks: {
        website: String,
        linkedin: String,
        github: String,
        twitter: String
    },

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
