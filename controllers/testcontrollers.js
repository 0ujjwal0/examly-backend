const asyncHandler = require("express-async-handler");
const Test = require("../modal/testmodal");

// Create a new test
const createTest = asyncHandler(async (req, res) => {
  const { title, description, questions } = req.body;

  const test = new Test({
    title,
    description,
    questions,
  });

  const createdTest = await test.save();
  res.status(201).json(createdTest);
});

// Get all tests
const getTests = asyncHandler(async (req, res) => {
  const tests = await Test.find({ isDeleted: false });
  res.json(tests);
});

// Get test by ID
const getTestById = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id).populate("questions");

  if (test && !test.isDeleted) {
    res.json(test);
  } else {
    res.status(404).json({ message: "Test not found" });
  }
});

// Update a test
const updateTest = asyncHandler(async (req, res) => {
  const { title, description, questions, isDeleted } = req.body;

  const test = await Test.findById(req.params.id);

  if (test) {
    test.title = title || test.title;
    test.description = description || test.description;
    test.questions = questions || test.questions;
    test.isDeleted = isDeleted !== undefined ? isDeleted : test.isDeleted;

    const updatedTest = await test.save();
    res.json(updatedTest);
  } else {
    res.status(404).json({ message: "Test not found" });
  }
});

// Delete a test (soft delete)
const deleteTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);

  if (test) {
    test.isDeleted = true;
    await test.save();
    res.json({ message: "Test deleted successfully" });
  } else {
    res.status(404).json({ message: "Test not found" });
  }
});

module.exports = { createTest, getTests, getTestById, updateTest, deleteTest };
