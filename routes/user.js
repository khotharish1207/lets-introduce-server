const express = require("express");
const User = require("../models/users");

const router = express.Router();

/**
 * @swagger
 * /user/find-and-update
 *   post:
 *     description: return user with matching email, create if not available
 *     responses:
 *       200:
 *         description: return user with matching email
 */
router.post("/find-and-update", async (req, res) => {
  const { email } = req.body;
  try {
    var query = { email },
      update = { expire: new Date() },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };

    // Find the document
    const abc = await User.findOneAndUpdate(query, update, options).populate(
      "sites"
    );

    res.status(200).json(abc.toJSON());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
