import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import CustomButton from '../components/CustomButton.jsx';
import './ChartWithTable.css';

const ChartWithTable = () => {
    const navigate = useNavigate();

    const [data] = useState([
        { nome: 'Produto 1', versao: '1.0', link: 'https://link1.com', id: 1 },
        { nome: 'Produto 2', versao: '1.1', link: 'https://link2.com', id: 2 },
        { nome: 'Produto 3', versao: '2.0', link: 'https://link3.com', id: 3 },
        { nome: 'Produto 4', versao: '1.2', link: 'https://link4.com', id: 4 },
        { nome: 'Produto 5', versao: '1.5', link: 'https://link5.com', id: 5 },
        { nome: 'Produto 6', versao: '3.0', link: 'https://link6.com', id: 6 },
        { nome: 'Produto 7', versao: '2.5', link: 'https://link7.com', id: 7 },
        { nome: 'Produto 8', versao: '1.6', link: 'https://link8.com', id: 8 },
    ]);

    const handleRedirect = (row) => {
        navigate(`/teste`);
    };

    const columns = React.useMemo(
        () => [
            {
                Header: 'Nome',
                accessor: 'nome',
            },
            {
                Header: 'Versão',
                accessor: 'versao',
            },
            {
                Header: 'Link',
                accessor: 'link',
            },
            {
                Header: '',
                accessor: 'col4',
                Cell: ({ row }) => (
                    <button
                        className="svg-button"
                        onClick={() => handleRedirect(row)}
                    >
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_295_2906)">
                            <path d="M15.3246 16.7729L12.0459 13.4657L8.73869 16.7444L7.33082 15.3243L10.638 12.0456L7.35931 8.73837L8.77941 7.3305L12.0581 10.6377L15.3653 7.35898L16.7732 8.77909L13.466 12.0578L16.7447 15.365L15.3246 16.7729Z" fill="#4F4F4F"/>
                            <path d="M11.9999 24.0519C9.62654 24.0416 7.30953 23.3278 5.34186 22.0007C3.37419 20.6736 1.84424 18.7928 0.945483 16.5962C0.0467235 14.3996 -0.180478 11.9858 0.292608 9.66005C0.765694 7.3343 1.91782 5.20107 3.60329 3.53011C5.28877 1.85915 7.43189 0.725525 9.76164 0.272575C12.0914 -0.180377 14.5031 0.067697 16.6919 0.985425C18.8807 1.90315 20.7481 3.44931 22.0582 5.42839C23.3682 7.40746 24.0619 9.73056 24.0517 12.1039C24.0345 15.2854 22.7559 18.3302 20.4965 20.5701C18.2371 22.81 15.1814 24.0622 11.9999 24.0519V24.0519ZM12.095 2.05211C10.1173 2.04355 8.18134 2.62167 6.53211 3.71337C4.88288 4.80506 3.59441 6.36128 2.82964 8.18525C2.06487 10.0092 1.85814 12.019 2.2356 13.9605C2.61305 15.9019 3.55775 17.6879 4.95021 19.0924C6.34267 20.497 8.12037 21.4571 10.0585 21.8513C11.9966 22.2456 14.0081 22.0562 15.8386 21.3073C17.6692 20.5583 19.2365 19.2834 20.3424 17.6436C21.4483 16.0039 22.0431 14.0731 22.0517 12.0953C22.0603 9.44401 21.0168 6.89762 19.1502 5.0148C17.2835 3.13197 14.7463 2.06648 12.095 2.05211Z" fill="#4F4F4F"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_295_2906">
                            <rect width="24" height="24" fill="white" transform="matrix(0.999991 0.0043252 0.0043252 -0.999991 0 24)"/>
                            </clipPath>
                            </defs>
                        </svg>

                    </button>
                ),
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
    });

    // Lógica de paginação
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 7;
    const totalPages = Math.ceil(rows.length / rowsPerPage);
    const currentRows = rows.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        
        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(
                    <button 
                        key={i} 
                        className={`pagination-button ${currentPage === i ? 'active' : ''}`}
                        onClick={() => setCurrentPage(i)}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            // Always show the first page
            buttons.push(
                <button 
                    key={1} 
                    className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(1)}
                >
                    1
                </button>
            );

            // Show ellipsis if necessary
            if (currentPage > 3) {
                buttons.push(<span key="ellipsis-start">...</span>);
            }

            // Show current page and surrounding pages
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);
            for (let i = startPage; i <= endPage; i++) {
                buttons.push(
                    <button 
                        key={i} 
                        className={`pagination-button ${currentPage === i ? 'active' : ''}`}
                        onClick={() => setCurrentPage(i)}
                    >
                        {i}
                    </button>
                );
            }

            // Show ellipsis if necessary
            if (currentPage < totalPages - 2) {
                buttons.push(<span key="ellipsis-end">...</span>);
            }

            // Always show the last page
            buttons.push(
                <button 
                    key={totalPages} 
                    className={`pagination-button ${currentPage === totalPages ? 'active' : ''}`}
                    onClick={() => setCurrentPage(totalPages)}
                >
                    {totalPages}
                </button>
            );
        }

        return buttons;
    };

    // Adicionando linhas vazias se não houver dados suficientes
    const emptyRows = Array.from({ length: rowsPerPage - currentRows.length }, (_, index) => (
        <tr key={`empty-${index}`} className="table-row-light">
            <td colSpan={columns.length}>&nbsp;</td>
        </tr>
    ));

    return (
        <div className="table-container">
            <table {...getTableProps()} className="custom-table">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()} className="table-header">
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {currentRows.map((row, index) => {
                        prepareRow(row);
                        return (
                            <tr
                                {...row.getRowProps()}
                                className={index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
                            >
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()} className="table-cell">
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                    {emptyRows} {/* Adiciona as linhas vazias */}
                </tbody>
            </table>

            {/* Controles de paginação */}
            <div className="pagination-controls">
                {renderPaginationButtons()}
            </div>
        </div>
    );
};

export default ChartWithTable;
