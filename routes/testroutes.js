const express = require("express");
const {
  createTest,
  getTests,
  getTestById,
  updateTest,
  deleteTest,
} = require("../controllers/testcontrollers");
const { protect } = require("../middleware/authmiddleware");
const router = express.Router();

router.route("/").post(protect, createTest).get(protect, getTests);
router
  .route("/:id")
  .get(protect, getTestById)
  .put(protect, updateTest)
  .delete(protect, deleteTest);

module.exports = router;
