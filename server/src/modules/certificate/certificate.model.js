const { Schema, model } = require("mongoose");

const CertificateSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    courseTitle: { type: String, required: true }, // Snapshot in case course is deleted/changed
    userName: { type: String, required: true }, // Snapshot
    instructorName: { type: String, required: true }, // Snapshot
    issueDate: { type: Date, default: Date.now },
    certificateId: { type: String, required: true, unique: true }, // UUID or similar
  },
  { timestamps: true }
);

module.exports = model("Certificate", CertificateSchema);
