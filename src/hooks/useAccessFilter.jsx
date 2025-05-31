import { useEffect, useState } from "react";
import { filterAccessData } from "../utils/accessHelpers";

const useAccessFilter = (originalData, search, statusFilter) => {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const result = filterAccessData(originalData, search, statusFilter);
    setFilteredData(result);
  }, [originalData, search, statusFilter]);

  return filteredData;
};

export default useAccessFilter;
