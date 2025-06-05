import React from "react";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {

  if (totalPages <= 1) return null;

  const handleClick = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => handleClick(i + 1)}
          className={`pagination-btn ${currentPage === i + 1 ? "active-page" : ""}`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
