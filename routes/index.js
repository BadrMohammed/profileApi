const verifiyJWT = require("../middleware/verifiyJWT");
const authenticationRoutes = require("./authenticationRoutes");

const userRoutes = require("./userRoutes");
const countryRoutes = require("./countryRoutes");

const cityRoutes = require("./cityRoutes");

const areaRoutes = require("./areaRoutes");

const categoryRoutes = require("./categoryRoutes");

const productRoutes = require("./productRoutes");

const otpRoutes = require("./otpRoutes");
const cartRoutes = require("./cartRoutes");
const reviewRoutes = require("./reviewRoutes");
const wishlistRoutes = require("./wishlistRoutes");
const discountRoutes = require("./discountRoutes");

function combineRoutes(app) {
  //without token
  app.use("/api/v1/otp", otpRoutes);

  //to authorized all routes (with token)
  app.use(verifiyJWT);
  app.use("/api/v1/user", userRoutes);
  app.use("/api/v1/country", countryRoutes);
  app.use("/api/v1/city", cityRoutes);
  app.use("/api/v1/area", areaRoutes);
  app.use("/api/v1/category", categoryRoutes);
  app.use("/api/v1/product", productRoutes);
  app.use("/api/v1/cart", cartRoutes);
  app.use("/api/v1/review", reviewRoutes);
  app.use("/api/v1/wishlist", wishlistRoutes);
  app.use("/api/v1/discount", discountRoutes);
  app.use("/api/v1/auth", authenticationRoutes);
}

module.exports = combineRoutes;
