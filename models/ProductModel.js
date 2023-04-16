const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = new Schema(
  {
    images: [{ url: String, id: Number }],
    nameEn: { type: String, required: true },
    nameAr: { type: String, required: true },
    descriptionEn: { type: String },
    descriptionAr: { type: String },
    price: { type: String, required: true },
    oldPrice: { type: String },
    specifications: [{ key: String, value: String }],
    quantity: { type: Number, required: true },
    color: { type: String, default: null },
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    countryId: {
      type: Schema.Types.ObjectId,
      ref: "countries",
      required: true,
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
productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("products", productSchema);
