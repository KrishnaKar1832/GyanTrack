const QuestionCard = ({ question, onAnswer }) => {
  return (
    <div>
      <h3>{question.text}</h3>
      {question.options.map((opt, index) => (
        <div key={index}>
          <input
            type={question.type === "MCQ" ? "radio" : "checkbox"}
            name={question.id}
            onChange={() => onAnswer(question.id, opt)}
          />
          {opt}
        </div>
      ))}
    </div>
  );
};

export default QuestionCard;