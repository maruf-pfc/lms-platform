const app = require("./app");
const connectDB = require("./db");
const PORT = process.env.PORT || 3340;

// connect to database first
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});
