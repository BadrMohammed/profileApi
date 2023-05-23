//connect with database
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(process.env.DATABASE_URL);
    mongoose.set("strictQuery", false);
    await mongoose.connect(
      "mongodb+srv://badr:badr1234@cluster0.ewjkail.mongodb.net/profile?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
  } catch (err) {
    console.log(err);
  }
};
module.exports = connectDB;
