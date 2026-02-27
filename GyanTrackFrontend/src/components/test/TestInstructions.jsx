const TestInstructions = ({ onStart }) => {
  return (
    <div>
      <h2>Test Guidelines</h2>
      <ul>
        <li>No tab switching</li>
        <li>No copy paste</li>
        <li>Stay in fullscreen</li>
      </ul>
      <button onClick={onStart}>Start Test</button>
    </div>
  );
};

export default TestInstructions;