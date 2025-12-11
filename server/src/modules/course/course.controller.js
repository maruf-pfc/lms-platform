const Course = require("./course.model");
const Module = require("./module.model");
const User = require("../users/user.model");

exports.createCourse = async (req, res, next) => {
    try {
        const { title, description, category, thumbnail } = req.body;

        // Create course
        const course = await Course.create({
            title,
            description,
            category,
            thumbnail,
            instructor: req.user.id,
        }); // Price is default 0

        res.status(201).json(course);
    } catch (err) {
        next(err);
    }
};

exports.getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find()
            .populate("instructor", "name email")
            .select("-students"); // Don't fetch all students list
        res.json(courses);
    } catch (err) {
        next(err);
    }
};

exports.getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate("instructor", "name")
            .populate("students", "name"); // Maybe limit this?

        if (!course) return res.status(404).json({ message: "Course not found" });

        const modules = await Module.find({ course: req.params.id }).sort("order");

        const result = course.toObject();
        result.modules = modules;

        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.enrollCourse = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const userId = req.user.id;

        // Check user role
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: "Only students can enroll" });
        }

        // 1. Check if already enrolled in THIS course
        const user = await User.findById(userId);
        const existingEnrollment = user.enrolledCourses.find(
            (e) => e.course.toString() === courseId
        );

        if (existingEnrollment) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }

        // 2. Check strict constraint: "Student can purchase 1 course at a time"
        // Meaning: No other ACTIVE (not completed) course.
        const activeCourse = user.enrolledCourses.find((e) => e.completedAt === null);

        if (activeCourse) {
            return res.status(400).json({
                message: "You have an active course. Complete it before enrolling in a new one."
            });
        }

        // Proceed to enroll
        // Update User
        user.enrolledCourses.push({
            course: courseId,
            enrolledAt: new Date(),
        });
        await user.save();

        // Update Course
        await Course.findByIdAndUpdate(courseId, {
            $addToSet: { students: userId },
            $inc: { enrolledCount: 1 }
        });

        res.json({ message: "Enrolled successfully" });

    } catch (err) {
        next(err);
    }
};

exports.markModuleCompleted = async (req, res, next) => {
    try {
        const { id: courseId, moduleId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        const enrollment = user.enrolledCourses.find(e => e.course.toString() === courseId);

        if (!enrollment) {
            return res.status(403).json({ message: "Not enrolled in this course" });
        }

        // Check if already completed
        if (enrollment.completedModules.includes(moduleId)) {
            return res.json({ message: "Module already completed" });
        }

        // Validate sequence
        const modules = await Module.find({ course: courseId }).sort("order");
        const currentModuleIndex = modules.findIndex(m => m._id.toString() === moduleId);

        if (currentModuleIndex === -1) {
            return res.status(404).json({ message: "Module not found" });
        }

        // If strict sequence required: check if previous module completed
        if (currentModuleIndex > 0) {
            const prevModuleId = modules[currentModuleIndex - 1]._id.toString();
            if (!enrollment.completedModules.includes(prevModuleId)) {
                return res.status(400).json({ message: "Previous module not completed" });
            }
        }

        // Mark as completed
        enrollment.completedModules.push(moduleId);

        // Update progress
        enrollment.progress = Math.round((enrollment.completedModules.length / modules.length) * 100);

        // Check if course completed
        if (enrollment.completedModules.length === modules.length) {
            enrollment.completedAt = new Date();
            user.points += 100; // Bonus points
        }

        // Add points per module
        user.points += 10;

        await user.save();

        res.json({
            message: "Module completed",
            progress: enrollment.progress,
            completedAt: enrollment.completedAt
        });

    } catch (err) {
        next(err);
    }
};

exports.submitMCQ = async (req, res, next) => {
    try {
        const { id: courseId, moduleId } = req.params;
        const { answers, cheated, subModuleId } = req.body; // answers: { questionId: optionString }
        const userId = req.user.id;

        // 1. Fetch Module to get correct answers
        const module = await Module.findById(moduleId);
        if (!module) return res.status(404).json({ message: "Module not found" });

        const subModule = module.subModules.id(subModuleId);
        if (!subModule || subModule.type !== 'mcq') {
            return res.status(400).json({ message: "Invalid MCQ module" });
        }

        // 2. Score the quiz
        let score = 0;
        let totalPoints = 0;

        subModule.questions.forEach((q) => {
            totalPoints += q.points;
            const userAnswer = answers[q._id];
            if (userAnswer === q.correctAnswer) {
                score += q.points;
            }
        });

        // 3. Cheating Penalty
        const passed = score >= (totalPoints * 0.7) && !cheated; // 70% passing + No Cheating

        if (cheated) {
            console.log(`User ${userId} cheated in module ${moduleId}`);
        }

        res.json({
            score,
            totalPoints,
            passed,
            cheated,
            message: cheated ? "Cheating detected! Quiz failed." : passed ? "Quiz Passed!" : "Quiz Failed. Try again."
        });

    } catch (err) {
        next(err);
    }
};
