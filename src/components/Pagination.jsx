import React from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="pagination-container">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="pagination-btn nav-btn"
      >
        <IconChevronLeft size={18} />
      </button>

      <span className="pagination-info">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="pagination-btn nav-btn"
      >
        <IconChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
