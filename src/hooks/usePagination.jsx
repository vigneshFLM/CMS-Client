import { useState } from "react";

const usePagination = (data = [], rowsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  return {
    currentData,
    currentPage,
    setCurrentPage,
    totalPages,
    indexOfFirst,
  };
};

export default usePagination;
