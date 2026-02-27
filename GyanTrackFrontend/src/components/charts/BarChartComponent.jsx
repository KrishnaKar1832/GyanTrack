import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const BarChartComponent = ({ data }) => {
  return (
    <BarChart width={500} height={300} data={data}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="score" fill="#82ca9d" />
    </BarChart>
  );
};

export default BarChartComponent;