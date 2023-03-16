const verifiyJWT = require("../middleware/verifiyJWT");
const authenticationRoutesWithoutToken = require("./auth/authenticationRoutesWithoutToken");
const authenticationRoutesWithToken = require("./auth/authenticationRoutesWithToken");

const userRoutes = require("./userRoutes");
const countryRoutesWithToken = require("./country/countryRoutesWithToken");
const countryRoutesWithoutToken = require("./country/countryRoutesWithoutToken");

const cityRoutesWithToken = require("./city/cityRoutesWithToken");
const cityRoutesWithoutToken = require("./city/cityRoutesWithoutToken");

const areaRoutesWithToken = require("./area/areaRoutesWithToken");
const areaRoutesWithoutToken = require("./area/areaRoutesWithoutToken");

const otpRoutes = require("./otpRoutes");

function combineRoutes(app) {
  //without token
  app.use("/api/v1/auth", authenticationRoutesWithoutToken);
  app.use("/api/v1/country", countryRoutesWithoutToken);
  app.use("/api/v1/city", cityRoutesWithoutToken);
  app.use("/api/v1/area", areaRoutesWithoutToken);
  app.use("/api/v1/otp", otpRoutes);

  //to authorized all routes (with token)
  app.use(verifiyJWT);
  app.use("/api/v1/auth", authenticationRoutesWithToken);
  app.use("/api/v1/user", userRoutes);
  app.use("/api/v1/country", countryRoutesWithToken);
  app.use("/api/v1/city", cityRoutesWithToken);
  app.use("/api/v1/area", areaRoutesWithToken);
}

module.exports = combineRoutes;
