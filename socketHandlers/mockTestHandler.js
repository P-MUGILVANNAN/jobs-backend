const Question = require("../models/Question");
const MockResult = require("../models/MockResult");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    let currentTest = {
      name: "",
      mobile: "",
      questions: [],
      answers: []
    };

    // Start Test Event
    socket.on("start_test", async (data) => {
      try {
        currentTest.name = data.name;
        currentTest.mobile = data.mobile;

        // Fetch 15 random questions
        const questions = await Question.aggregate([{ $sample: { size: 15 } }]);
        currentTest.questions = questions;

        socket.emit("question", {
          index: 0,
          question: questions[0].question,
          options: questions[0].options
        });
      } catch (err) {
        console.error("❌ Error starting test:", err.message);
        socket.emit("error_message", "Unable to start test");
      }
    });

    // Receive Answer
    socket.on("answer", (data) => {
      const { index, answer } = data;
      currentTest.answers.push(answer);

      if (index + 1 < currentTest.questions.length) {
        socket.emit("question", {
          index: index + 1,
          question: currentTest.questions[index + 1].question,
          options: currentTest.questions[index + 1].options
        });
      } else {
        // Calculate Score
        let score = 0;
        currentTest.questions.forEach((q, i) => {
          if (
            q.correctAnswer.trim().toLowerCase() ===
            (currentTest.answers[i] || "").trim().toLowerCase()
          ) {
            score++;
          }
        });

        // Save result in MongoDB
        const result = new MockResult({
          name: currentTest.name,
          mobile: currentTest.mobile,
          questions: currentTest.questions,
          answers: currentTest.answers,
          score
        });

        result.save()
          .then(() => console.log("✅ Result saved"))
          .catch(err => console.error("❌ Error saving result:", err.message));

        // Send result back to frontend
        socket.emit("result", {
          message: "✅ Test Completed!",
          score: score,
          total: currentTest.questions.length
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("❎ User disconnected:", socket.id);
    });
  });
};
