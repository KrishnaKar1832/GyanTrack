const PerformanceFilter = ({ onFilter }) => {
  return (
    <select onChange={(e) => onFilter(e.target.value)}>
      <option value="all">All</option>
      <option value="latest">Latest</option>
      <option value="highest">Highest</option>
    </select>
  );
};

export default PerformanceFilter;