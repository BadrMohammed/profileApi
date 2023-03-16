const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const areaSchema = new Schema(
  {
    nameEn: String,
    nameAr: String,
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    cityId: { type: Schema.Types.ObjectId, ref: "cities" },
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
areaSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("areas", areaSchema);
