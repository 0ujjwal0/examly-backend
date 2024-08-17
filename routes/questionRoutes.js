const express = require("express");
const {
  createQuestion,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getAllQuestions,
} = require("../controllers/questioncontroller");
const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

router.route("/").post(protect, createQuestion).get(protect, getAllQuestions);

router
  .route("/:id")
  .get(protect, getQuestionById)
  .put(protect, updateQuestion)
  .delete(protect, deleteQuestion);

module.exports = router;
