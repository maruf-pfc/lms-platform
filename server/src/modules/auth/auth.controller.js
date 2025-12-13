const authService = require("./auth.service");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const { token, user } = await authService.register({
      name,
      email,
      password,
      role,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { token, user } = await authService.login(email, password);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res) => {
  // Return full user profile (excluding passwordHash which middleware should handle or we explicitly exclude)
  // Assuming req.user is the mongoose doc
  const user = req.user.toObject();
  delete user.passwordHash;
  res.json(user);
};

exports.logout = async (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};
