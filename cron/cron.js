const cron = require("node-cron");
const Submission = require("../modal/submissionsmodal");
const Question = require("../modal/questionmodal");
const User=require("../modal/usermodal")
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

cron.schedule("* * * * *", async () => {
  console.log("Running Cron Job: Checking submissions and calculating marks");

  try {
    // Fetch all submissions that have not been graded yet
    const submissions = await Submission.find({ isGraded: false });

    for (const submission of submissions) {
      let totalMarks = 0;

      for (const selection of submission.selections) {
        const question = await Question.findById(selection.questionId);

        if (question && question.correctOption === selection.option) {
          totalMarks += question.marks;
        }
      }

      // Update submission with total marks and mark it as graded
      submission.marks = totalMarks;
      submission.isGraded = true;
      await submission.save();
      const user = await User.findById(submission.userId);
    
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email, // Assuming the user's email is stored in the userId field
        subject: "Your Test Results",
        text: `Dear ${user.name},\n\nYou have completed the test and scored ${totalMarks} marks.\n\nBest regards,\nExamts Team`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    }

    console.log("Submissions have been graded successfully");
  } catch (error) {
    console.error("Error grading submissions:", error);
  }
});
