import { useNavigate } from "react-router-dom";

const LiveTest = () => {
  const navigate = useNavigate();
  return <button onClick={() => navigate("/test/1")}>Start Live Test</button>;
};

export default LiveTest;