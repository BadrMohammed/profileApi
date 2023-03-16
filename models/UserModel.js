const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const isEmail = require("validator").isEmail;
const mongoosePaginate = require("mongoose-paginate-v2");
const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    addresses: [
      {
        _id: false,
        country: { type: Schema.Types.ObjectId, ref: "countries" },
        city: { type: Schema.Types.ObjectId, ref: "cities" },
        area: { type: Schema.Types.ObjectId, ref: "areas" },
        street: String,
        building: Number,
        floor: Number,
        apartment: Number,
        isDefault: { type: Boolean, default: false },
      },
    ],
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
    mobile: String,
    birthDate: Date,
    token: String,
    userType: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    permissions: { type: Array, default: undefined },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: "" },
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
