const router = require("express").Router();

router.use("/auth", require("../modules/auth/auth.routes"));
router.use("/courses", require("../modules/course/course.routes"));
router.use("/users", require("../modules/users/user.routes"));
// router.use("/gamification", require("../modules/gamification/gamification.routes"));
router.use("/community", require("../modules/community/post.routes"));
// router.use("/forum", require("../modules/forum/forum.routes")); // Deprecated, using unified community
router.use("/admin", require("../modules/admin/admin.routes")); // Keep checking if this exists or create it
router.use("/upload", require("../modules/upload/upload.routes"));

module.exports = router;
