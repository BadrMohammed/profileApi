const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const reviewModel = new Schema(
  {
    rating: { type: Number, default: 0 },
    comment: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "products", required: true },
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
reviewModel.plugin(mongoosePaginate);

module.exports = mongoose.model("reviews", reviewModel);
