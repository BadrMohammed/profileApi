const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const discountSchema = new Schema(
  {
    discount: { type: String, required: true },
    isPercentage: { type: Boolean, default: false },
    allCategories: { type: Boolean, default: false },
    isCategories: { type: Boolean, default: false },
    isProducts: { type: Boolean, default: false },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: "categories" }],
    productIds: [{ type: Schema.Types.ObjectId, ref: "products" }],
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    validDate: { type: Date, required: true },
    isValid: { type: Boolean, default: false },
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
discountSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("discounts", discountSchema);
