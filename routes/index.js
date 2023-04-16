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

const categoryRoutesWithToken = require("./category/categoryRoutesWithToken");
const categoryRoutesWithoutToken = require("./category/categoryRoutesWithoutToken");

const productRoutes = require("./productRoutes");

const otpRoutes = require("./otpRoutes");
const cartRoutes = require("./cartRoutes");
const reviewRoutes = require("./reviewRoutes");
const wishlistRoutes = require("./wishlistRoutes");
const discountRoutes = require("./discountRoutes");

function combineRoutes(app) {
  //without token
  app.use("/api/v1/auth", authenticationRoutesWithoutToken);
  app.use("/api/v1/country", countryRoutesWithoutToken);
  app.use("/api/v1/city", cityRoutesWithoutToken);
  app.use("/api/v1/area", areaRoutesWithoutToken);
  app.use("/api/v1/otp", otpRoutes);
  app.use("/api/v1/category", categoryRoutesWithoutToken);

  //to authorized all routes (with token)
  app.use(verifiyJWT);
  app.use("/api/v1/auth", authenticationRoutesWithToken);
  app.use("/api/v1/user", userRoutes);
  app.use("/api/v1/country", countryRoutesWithToken);
  app.use("/api/v1/city", cityRoutesWithToken);
  app.use("/api/v1/area", areaRoutesWithToken);
  app.use("/api/v1/category", categoryRoutesWithToken);
  app.use("/api/v1/product", productRoutes);
  app.use("/api/v1/cart", cartRoutes);
  app.use("/api/v1/review", reviewRoutes);
  app.use("/api/v1/wishlist", wishlistRoutes);
  app.use("/api/v1/discount", discountRoutes);
}

module.exports = combineRoutes;
