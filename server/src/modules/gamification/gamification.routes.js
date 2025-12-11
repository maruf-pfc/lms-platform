const router = require("express").Router();
const leaderboardController = require("./leaderboard.controller");
const certificateController = require("./certificate.controller");
const { auth } = require("../../middlewares/auth.middleware");

router.get("/leaderboard", leaderboardController.getLeaderboard); // Public or Auth? User said "students can see", implied public or auth.
router.get("/certificate/:courseId", auth, certificateController.generateCertificate);

module.exports = router;
