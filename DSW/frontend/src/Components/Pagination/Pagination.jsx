import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  
  const renderPaginationButtons = () => {
    const buttons = [];

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            className={`pagination-button ${currentPage === i ? 'active' : ''}`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      buttons.push(
        <button 
          key={1} 
          className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
          onClick={() => onPageChange(1)}
        >
          1
        </button>
      );

      if (currentPage > 3) {
        buttons.push(<span className="ellipsis-pagination" key="ellipsis-start">...</span>);
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <button 
            key={i} 
            className={`pagination-button ${currentPage === i ? 'active' : ''}`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        buttons.push(<span className="ellipsis-pagination" key="ellipsis-end">...</span>);
      }

      buttons.push(
        <button 
          key={totalPages} 
          className={`pagination-button ${currentPage === totalPages ? 'active' : ''}`}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  if (totalPages <= 1) {
    return null; 
  }

  return (
    <>
      {renderPaginationButtons()}
    </>
  );
};

export default Pagination;