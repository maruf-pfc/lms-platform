const { Schema, model } = require("mongoose");

const SubModuleSchema = new Schema({
    title: { type: String, required: true },
    type: {
        type: String,
        enum: ["video", "documentation", "mcq", "summary", "project"],
        required: true,
    },
    content: { type: String }, // For markdown, can be long text
    videoUrl: { type: String }, // For video type

    // For MCQ
    questions: [{
        questionText: String,
        options: [String],
        correctAnswer: String, // or index
        points: { type: Number, default: 10 },
    }],

    // For Project
    repoLinkPlaceholder: { type: String }, // Instruction for submission
});

const ModuleSchema = new Schema(
    {
        course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        title: { type: String, required: true },
        order: { type: Number, default: 0 },

        subModules: [SubModuleSchema],
    },
    { timestamps: true }
);

module.exports = model("Module", ModuleSchema);
