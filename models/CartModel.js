const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "products", required: true },
    quantity: { type: Number, required: true },
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
cartSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("cart", cartSchema);
