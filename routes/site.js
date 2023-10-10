const express = require("express");
const mongoose = require("mongoose");
const dbModel = require("../models/dbModel");
const Users = require("../models/users");
const utils = require("../util/serverUtil");

const router = express.Router();


/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getUserMiddleware = (req, res, next) => {
  const cred = req.header("x-auth-credential");

  if (!cred) {
    res.status(401).json({ message: "unauthorised" });
  }

  const { email } = utils.parseJwt(cred);
  req.user = { email };

  next();
};

/**
 *
 * @param {string} endpoint to be find in site collection
 * @returns
 */
async function getSitebyIdorEndpoint(endpoint) {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(endpoint);
  const query = isValidObjectId
    ? { _id: new mongoose.Types.ObjectId(endpoint) }
    : { endpoint: endpoint };

  const site = await dbModel.findOne(query);

  return site;
}

/**
 *
 */
router.post("/create-new", getUserMiddleware, async (req, res) => {
  const obj = new dbModel({ ...req.body });

  try {
    const { _id } = await obj.save();
    const user = await Users.findOneAndUpdate(req.user, {
      $push: { sites: _id },
    });
    console.log("user", user);
    res.status(200).json({ message: "cretaed successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 *
 */
router.patch("/update/:id", getUserMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const { images, ...rest } = req.body;
    // const img = images.map(({ url, ...rest }) => {
    //   console.log(rest.name, typeof url);
    //   if (url) {
    //     const [imagePrefix, base64String] = url.split(",");
    //     return {
    //       ...rest,
    //       url: {
    //         image: base64String,
    //         imagePrefix,
    //       },
    //     };
    //   }

    //   return {
    //     ...rest,
    //     url: {
    //       image: "",
    //       imagePrefix: "",
    //     },
    //   };
    // });

    console.log(images);
    await dbModel.findByIdAndUpdate(id, { ...rest, images });
    res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

/**
 *
 */
router.get("/verify-endpoint/:endpoint", async (req, res) => {
  const { endpoint } = req.params;
  try {
    const site = await getSitebyIdorEndpoint(endpoint);
    res.status(200).json({
      "available-to-use": !Boolean(site),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 *
 */
router.get("/find/:endpoint", async (req, res) => {
  const { endpoint } = req.params;
  try {
    const site = await getSitebyIdorEndpoint(endpoint);
    if (site) {
      return res.status(200).json(site);
    }
    res.status(400).json({ message: "Site is not found" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
