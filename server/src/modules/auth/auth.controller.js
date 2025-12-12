const authService = require("./auth.service");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const result = await authService.register({
      name,
      email,
      password,
      role,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res) => {
  res.json({
    id: req.user.id,
    role: req.user.role,
    email: req.user.email,
    name: req.user.name,
    points: req.user.points,
    enrolledCourses: req.user.enrolledCourses
  });
};
