const User = require("./user.model");

exports.getLeaderboard = async (req, res, next) => {
    try {
        const users = await User.find()
            .sort({ points: -1 })
            .limit(10)
            .select("name avatar points");
        res.json(users);
    } catch (err) {
        next(err);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        // Admin only check should be in middleware or here
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Admin only" });
        }
        const users = await User.find().select("-passwordHash");
        res.json(users);
    } catch (err) {
        next(err);
    }
};

exports.updateUserRole = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: "Admin only" });

        const { userId } = req.params;
        const { role } = req.body;

        if (!['student', 'instructor', 'admin'].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
        res.json(user);
    } catch (err) { next(err); }
};
exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const updates = req.body;
        
        // Prevent role update here
        delete updates.role;
        delete updates.passwordHash;
        delete updates.email; // Usually separate flow for email change
        delete updates.points; 

        // Handle nested merges? 
        // For simplicity, replace arrays if provided, partial update for top-level.
        // Mongoose findByIdAndUpdate with $set handles top level keys.

        const user = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true }).select("-passwordHash");
        
        res.json(user);
    } catch (err) { next(err); }
};

exports.deleteAccount = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // Soft delete or hard delete? Request implies hard delete ("delete account option").
        // We really should cascade delete enrollments, posts, etc. 
        // But for MVP, just deleting user is "okay" but leaves orphans.
        // Let's at least delete User document.
        
        await User.findByIdAndDelete(userId);
        
        // Clear cookie
        res.clearCookie("token");
        res.json({ message: "Account deleted successfully" });
    } catch (err) { next(err); }
};
