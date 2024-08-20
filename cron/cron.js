const cron = require("node-cron");
const Submission = require("../modal/submissionsmodal");
const Question = require("../modal/questionmodal");
const User = require("../modal/usermodal");
const nodemailer = require("nodemailer");
const pug = require("pug");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const compileTemplate = pug.compileFile(
  path.join(__dirname, "../template/emailtemplate.pug")
);

cron.schedule("* * * * *", async () => {
  console.log("Running Cron Job: Checking submissions and calculating marks");

  try {
    const submissions = await Submission.find({ isGraded: false });

    for (const submission of submissions) {
      let totalMarks = 0;

      for (const selection of submission.selections) {
        const question = await Question.findById(selection.questionId);

        if (question && question.correctOption === selection.option) {
          totalMarks += question.marks;
        }
      }

      submission.marks = totalMarks;
      submission.isGraded = true;
      await submission.save();

      const user = await User.findById(submission.userId);


      const html = compileTemplate({
        name: user.name,
        marks: totalMarks,
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Your Test Results have arrived!!!",
        html,
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
