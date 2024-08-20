const asyncHandler = require("express-async-handler");
const Submission = require("../modal/submissionsmodal");

//     Create a new submission
//    POST /api/submissions

const createSubmission = asyncHandler(async (req, res) => {
  const { testId, selections } = req.body;

  const submission = new Submission({
    testId,
    userId: req.user._id,
    selections,
  });

  const createdSubmission = await submission.save();

  res.status(201).json(createdSubmission);
});

//     Update an existing submission
//    PUT /api/submissions/:id

const updateSubmission = asyncHandler(async (req, res) => {
  const { selections } = req.body;

  const submission = await Submission.findById(req.params.id);

  if (submission && submission.userId.toString() === req.user._id.toString()) {
    submission.selections = selections;
    submission.updatedAt = Date.now();

    const updatedSubmission = await submission.save();

    res.json(updatedSubmission);
  } else {
    res.status(404);
    throw new Error("Submission not found or not authorized");
  }
});

//     Soft delete a submission
//    DELETE /api/submissions/:id

const deleteSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id);

  if (submission && submission.userId.toString() === req.user._id.toString()) {
    submission.isDeleted = true;
    submission.updatedAt = Date.now();

    await submission.save();

    res.json({ message: "Submission deleted" });
  } else {
    res.status(404);
    throw new Error("Submission not found or not authorized");
  }
});

module.exports = {
  createSubmission,
  updateSubmission,
  deleteSubmission,
};
