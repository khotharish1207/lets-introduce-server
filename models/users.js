const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Site = require("./dbModel");

const userSchema = new Schema({
  email: { type: String, unique: true },
  sites: [{ type: Schema.Types.ObjectId, ref: "sites" }],
});

userSchema.pre("save", (next) => {
  if (this.sites.length === 0) {
    this.site.push(new Site({}));
  }
  next();
});


userSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

const users = mongoose.model("users", userSchema);

module.exports = users;
