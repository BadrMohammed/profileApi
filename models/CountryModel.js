const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const countrySchema = new Schema(
  {
    nameEn: { type: String, unique: true },
    nameAr: { type: String, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
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
countrySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("countries", countrySchema);
