import { useState } from "react";

const QuestionForm = () => {
  const [question, setQuestion] = useState("");

  return (
    <div>
      <h3>Add Question</h3>
      <input
        placeholder="Enter question"
        onChange={(e) => setQuestion(e.target.value)}
      />
    </div>
  );
};

export default QuestionForm;