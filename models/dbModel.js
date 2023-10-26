const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactInformationSchema = new Schema({
  fname: { type: String, default: null },
  lname: { type: String, default: null },
  pronouns: { type: String, default: null },
  title: { type: String, default: null },
  biz: { type: String, default: null },
  addr: { type: String, default: null },
  desc: { type: String, default: null },
  key: { type: String, default: null },
  tracker: { type: String, default: null },
});

const pageDesignSchema = new Schema({
  logoBg: { type: String, default: `#059669` },
  mainBg: { type: String, default: `#ddd` },
  buttonBg: { type: String, default: `#059669` },
  cardBg: { type: String, default: `#fff` },
  fontLink: { type: String, default: "" },
  fontCss: { type: String, default: "" },
});

const imageSchema = new Schema({
  name: { type: String, default: null, required: true },
  url: { type: String, default: null },
  blob: { type: Schema.Types.Mixed, default: null },
  ext: { type: String, default: null },
  mime: { type: String, default: null },
  resized: { type: Schema.Types.Mixed, default: null },
});

const primaryActionSchema = new Schema({
  name: { type: String, default: null },
  icon: { type: String, default: null },
  href: { type: String, default: null },
  placeholder: { type: String, default: null },
  value: { type: String, default: null },
  label: { type: String, default: null },
  order: { type: Number, default: null },
  isURL: { type: Number, default: null },
});

const secondaryActionSchema = new Schema({
  name: { type: String, default: null },
  icon: { type: String, default: null },
  href: { type: String, default: null },
  placeholder: { type: String, default: null },
  value: { type: String, default: null },
  color: { type: String, default: null },
  light: { type: Number, default: null },
  gradientIcon: { type: Number, default: null },
  label: { type: String, default: null },
});

const featureSchema = new Schema({
  title: { type: String, default: null },
  content: [{ type: Schema.Types.Mixed, default: null }],
});

const dbModelSchema = new Schema({
  contactInformation: contactInformationSchema,
  pageDesign: pageDesignSchema,
  images: [imageSchema],
  actionItems: {
    primaryActions: [primaryActionSchema],
    secondaryActions: [secondaryActionSchema],
  },
  feature: [featureSchema],
  endpoint: { type: String, default: Date.now() },
});

dbModelSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    const imgs = ret.images.map(({ url, ...rest }) => {
      let toReturn = url;
      if (url && url?.image) {
        const { image, imagePrefix } = url;
        toReturn = [image, imagePrefix].join(",");
      }

      return { ...rest, url: toReturn };
    });

    delete ret._id;
    delete ret.__v;
    return ret;
  },
};


const dbModel = mongoose.model("sites", dbModelSchema);

module.exports = dbModel;
