import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './ChartWithTable.css';
import CustomInput from '../components/CustomInput.jsx';

const ChartWithTable = ({ idDispositivo }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [newSoftware, setNewSoftware] = useState({ nome: '', versao: '', link: '' });

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const csrfToken = getCookie('csrftoken');
                const response = await axios.get(`http://127.0.0.1:8000/api/soft-by-disp/?id_dispositivo=${idDispositivo}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        'X-CSRFToken': csrfToken,
                    }
                });
                setData(response.data.Software);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchData();
    }, [idDispositivo]);

    const handleDelete = async (id) => {
        try {
            const csrfToken = getCookie('csrftoken');
            await axios.delete(`http://127.0.0.1:8000/api/soft-delete/${id}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    'X-CSRFToken': csrfToken,
                }
            });
            setData(prevData => prevData.filter(software => software.id_software !== id));
        } catch (error) {
            setError("Erro ao excluir software: " + (error.response?.data?.detail || error.message));
        }
    };

    const handleAddSoftware = async () => {
        try {
            const csrfToken = getCookie('csrftoken');
            const response = await axios.post('http://127.0.0.1:8000/api/soft-create/', {
                nome: newSoftware.nome,
                versao: newSoftware.versao,
                link: newSoftware.link,
                id_dispositivo: idDispositivo
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    'X-CSRFToken': csrfToken,
                }
            });

            setData(prevData => [...prevData, response.data]);
            setNewSoftware({ nome: '', versao: '', link: '' });

        } catch (error) {
            setError("Erro ao adicionar software: " + (error.response?.data?.detail || error.message));
        }
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
                        onClick={() => handleDelete(row.original.id_software)}
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
            buttons.push(
                <button 
                    key={1} 
                    className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(1)}
                >
                    1
                </button>
            );


            if (currentPage > 3) {
                buttons.push(<span key="ellipsis-start">...</span>);
            }

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
                    {emptyRows}
                    <tr>
                        <td class="table-cell">
                        <CustomInput 
                            type="text"
                            placeholder="Nome"
                            value={newSoftware.nome}
                            onChange={(e) => setNewSoftware({ ...newSoftware, nome: e.target.value })}
                            className="input-field220"
                        />
                        </td>
                        <td class="table-cell">
                        <CustomInput 
                            type="text"
                            placeholder="Versão"
                            value={newSoftware.versao}
                            onChange={(e) => setNewSoftware({ ...newSoftware, versao: e.target.value })}
                            className="input-field220"
                        />
                        </td>
                        <td class="table-cell">
                        <CustomInput 
                            type="text"
                            placeholder="Link"
                            value={newSoftware.link}
                            onChange={(e) => setNewSoftware({ ...newSoftware, link: e.target.value })}
                            className="input-field220"
                        />
                        </td>
                        <td class="table-cell">
                            <button onClick={handleAddSoftware}
                                    className="svg-button">
                                
                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_2069_1079)">
                                        <path d="M12.5 0C10.0277 0 7.61099 0.733112 5.55538 2.10663C3.49976 3.48015 1.89761 5.43238 0.951511 7.71646C0.00541608 10.0005 -0.242126 12.5139 0.24019 14.9386C0.722505 17.3634 1.91301 19.5907 3.66117 21.3388C5.40933 23.087 7.63661 24.2775 10.0614 24.7598C12.4861 25.2421 14.9995 24.9946 17.2835 24.0485C19.5676 23.1024 21.5199 21.5002 22.8934 19.4446C24.2669 17.389 25 14.9723 25 12.5C24.9964 9.18589 23.6783 6.00855 21.3349 3.66512C18.9915 1.3217 15.8141 0.00358446 12.5 0V0ZM12.5 22.9167C10.4398 22.9167 8.42583 22.3057 6.71282 21.1611C4.9998 20.0165 3.66467 18.3897 2.87626 16.4863C2.08785 14.5829 1.88156 12.4884 2.28349 10.4678C2.68542 8.44717 3.67751 6.5911 5.13431 5.1343C6.59111 3.67751 8.44718 2.68542 10.4678 2.28349C12.4885 1.88156 14.5829 2.08784 16.4863 2.87626C18.3897 3.66467 20.0165 4.9998 21.1611 6.71281C22.3057 8.42582 22.9167 10.4398 22.9167 12.5C22.9136 15.2617 21.8152 17.9095 19.8624 19.8623C17.9095 21.8152 15.2617 22.9136 12.5 22.9167V22.9167ZM13.5417 11.4583H17.7083V13.5417H13.5417V17.7083H11.4583V13.5417H7.29167V11.4583H11.4583V7.29167H13.5417V11.4583Z" fill="#4F4F4F"/>
                                        </g>
                                        <defs>
                                        <clipPath id="clip0_2069_1079">
                                        <rect width="25" height="25" fill="white"/>
                                        </clipPath>
                                        </defs>
                                    </svg>



                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="pagination-controls">
                {renderPaginationButtons()}
            </div>
        </div>
    );
};

export default ChartWithTable;
