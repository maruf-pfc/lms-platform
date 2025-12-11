const router = require("express").Router();
const controller = require("./course.controller");
const { auth } = require("../../middlewares/auth.middleware");

// Public
router.get("/", controller.getAllCourses);
router.get("/:id", controller.getCourseById);

// Protected
router.post("/", auth, controller.createCourse); // Should restrict to instructor? Yes 
router.post("/:id/enroll", auth, controller.enrollCourse);
router.post("/:id/modules/:moduleId/complete", auth, controller.markModuleCompleted);
router.post("/:id/modules/:moduleId/submit-mcq", auth, controller.submitMCQ);

module.exports = router;
