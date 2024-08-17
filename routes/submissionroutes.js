const express = require("express");
const {
  createSubmission,
  updateSubmission,
  deleteSubmission,
} = require("../controllers/submissioncontroller");
const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

router.route("/").post(protect, createSubmission);
router
  .route("/:id")
  .delete(protect, deleteSubmission)
  .put(protect, updateSubmission);


module.exports = router;
