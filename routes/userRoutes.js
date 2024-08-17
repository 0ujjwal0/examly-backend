const express = require("express");
const {
  registerUser,
  authUser,
  deleteUser,
} = require("../controllers/usercontrollers");
const { protect } = require("../middleware/authmiddleware");
const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(authUser);
router.route("/delete/:id").delete(protect, deleteUser);
module.exports = router;
