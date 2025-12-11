const router = require("express").Router();

router.use("/auth", require("../modules/auth/auth.routes"));
router.use("/courses", require("../modules/course/course.routes"));
router.use("/gamification", require("../modules/gamification/gamification.routes"));
router.use("/forum", require("../modules/forum/forum.routes"));
router.use("/admin", require("../modules/admin/admin.routes"));

module.exports = router;
