const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const citySchema = new Schema(
  {
    nameEn: { type: String, unique: true },
    nameAr: { type: String, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    countryId: { type: Schema.Types.ObjectId, ref: "countries" },
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
citySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("cities", citySchema);
