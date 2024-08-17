const asyncHandler = require("express-async-handler");
const Question = require("../modal/questionmodal");

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private
const createQuestion = asyncHandler(async (req, res) => {
  const { question, options, correctOption, testId, marks } = req.body;

  const newQuestion = await Question.create({
    question,
    options,
    correctOption,
    testId,
    marks,
  });

  res.status(201).json(newQuestion);
});

// @desc    Get a question by ID
// @route   GET /api/questions/:id
// @access  Private
const getQuestionById = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);

  if (!question || question.isDeleted) {
    res.status(404);
    throw new Error("Question not found");
  }

  res.json(question);
});

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private
const updateQuestion = asyncHandler(async (req, res) => {
  const { question, options, correctOption, marks } = req.body;

  const updatedQuestion = await Question.findByIdAndUpdate(
    req.params.id,
    { question, options, correctOption, marks },
    { new: true, runValidators: true }
  );

  if (!updatedQuestion || updatedQuestion.isDeleted) {
    res.status(404);
    throw new Error("Question not found or has been deleted");
  }

  res.json(updatedQuestion);
});

// @desc    Delete a question (soft delete)
// @route   DELETE /api/questions/:id
// @access  Private
const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    res.status(404);
    throw new Error("Question not found");
  }

  question.isDeleted = true;
  await question.save();

  res.status(204).json({ message: "Question deleted" });
});

// @desc    Get all questions
// @route   GET /api/questions
// @access  Private
const getAllQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find({ isDeleted: false });
  res.json(questions);
});

module.exports = {
  createQuestion,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getAllQuestions,
};
