const userRoutes = require("./userRoutes");

function combineRoutes(app) {
  app.use("/api/v1/user", userRoutes);
}

module.exports = combineRoutes;
