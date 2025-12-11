const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true }, // Markdown
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },

        // Optional: link to a course context
        course: { type: Schema.Types.ObjectId, ref: "Course" },

        tags: [String],
        type: { type: String, enum: ["blog", "discussion", "question"], default: "discussion" },

        // Basic stats
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        views: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = model("Post", PostSchema);
