const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const categorySchema = new Schema(
  {
    image: String,
    nameEn: { type: String, required: true },
    nameAr: { type: String, required: true },
    descriptionEn: { type: String },
    descriptionAr: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    parent: { type: Schema.Types.ObjectId, ref: "categories" },
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
categorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("categories", categorySchema);
