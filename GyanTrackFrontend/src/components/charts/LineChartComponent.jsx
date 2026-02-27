import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const LineChartComponent = ({ data }) => {
  return (
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="score" stroke="#8884d8" />
    </LineChart>
  );
};

export default LineChartComponent;