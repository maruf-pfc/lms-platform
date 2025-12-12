const router = require("express").Router();
const controller = require("./user.controller");
const { auth } = require("../../middlewares/auth.middleware");

// Public (or protected?) - Leaderboard usually public or auth
router.get("/leaderboard", controller.getLeaderboard);

// Admin Routes
router.get("/", auth, controller.getAllUsers);
router.put("/:userId/role", auth, controller.updateUserRole);

module.exports = router;
