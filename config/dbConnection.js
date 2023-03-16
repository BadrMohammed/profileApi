//connect with database
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(process.env.DATABASE_URL);
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.DATABASE_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports = connectDB;
