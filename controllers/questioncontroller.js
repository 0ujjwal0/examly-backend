const asyncHandler = require("express-async-handler");
const Question = require("../modal/questionmodal");

//     Create a new question
//    POST /api/questions

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

//     Get a question by ID
//    GET /api/questions/:id

const getQuestionById = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);

  if (!question || question.isDeleted) {
    res.status(404);
    throw new Error("Question not found");
  }

  res.json(question);
});

//     Update a question
//    PUT /api/questions/:id

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

//    Delete a question (soft delete)
//    DELETE /api/questions/:id

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

//   Get all questions
//   GET /api/questions
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
