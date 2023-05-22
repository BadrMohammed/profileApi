const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const isEmail = require("validator").isEmail;
const mongoosePaginate = require("mongoose-paginate-v2");
const userSchema = new Schema(
  {
    fullName: String,
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail, "invalid email"],
    },
    password: {
      type: String,
      required: true,
      min: [8, "Password must be between 8 and 14 chractor"],
      max: [14, "Password must be between 8 and 14 chractor"],
    },
    phoneNumber: String,
    jopType: {
      type: String,
      enum: ["IT", "Marketing", "Business Development"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    id: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("users", userSchema);
