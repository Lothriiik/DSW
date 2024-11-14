import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Laboratories.module.css';
import Sidebar from '../../components/Sidebar';
import CircleButton from '../../components/CircleButton';
import CustomInput from '../../components/CustomInput';
import CardComputador from '../../components/CardComputador';
import CardDispositivos from '../../components/CardDispositivos';

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
};

function Laboratories() {
    const [dispositivos, setDispositivos] = useState([]); 
    const [error, setError] = useState(null); 
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;  // 3 cards por linha, 2 linhas por página
    const idSala = 1; 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const csrfToken = getCookie('csrftoken');
                const response = await axios.get(`http://127.0.0.1:8000/api/disp-by-lecc/?id_sala=${idSala}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        'X-CSRFToken': csrfToken,
                    }
                });
                setDispositivos(response.data.Dispositivos);
                console.log("Dispositivos recebidos:", response.data.Dispositivos); 
            } catch (error) {
                console.error("Erro ao carregar dispositivos:", error);
                setError('Erro ao carregar dispositivos');
            }
        };
        fetchData();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dispositivos.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(dispositivos.length / itemsPerPage);

    return (
        <main className={styles.Laboratories}>
            <section className={styles.principal}>
                <Sidebar />
                <div className={styles.mainContent}>
                    <div className={styles.header}>
                        <h1 className={styles.headerTitle}>Lecc 1</h1>
                        <div className={styles.controlsContainer}>
                            <div className={styles.deviceInputContainer}>
                                <span className={styles.deviceInfo}>Dispositivos: {dispositivos.length}</span>
                                <CustomInput
                                    placeholder="Pesquisar em x"
                                    className={`${styles.inputField} input-field320`}
                                />
                            </div>
                            <div className={styles.addButton}>
                                <CircleButton iconType="add"/>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formContainer}>
                        {error && <p>{error}</p>}

                        {currentItems.length > 0 ? (
                            <div className={styles.containerCard}>
                                {currentItems.map((dispositivo) => {
                                    
                                    return dispositivo.is_computador ? (
                                        <CardComputador
                                            key={dispositivo.id_dispositivo}
                                            tipo='Computador'
                                            patrimonio={dispositivo.patrimonio}
                                            descricao={dispositivo.descricao}
                                            status={dispositivo.status}
                                            data={dispositivo.data_verificacao}
                                        />
                                    ) : (
                                        <CardDispositivos
                                            key={dispositivo.id_dispositivo}
                                            tipo='Projetor'
                                            patrimonio={dispositivo.patrimonio}
                                            modelo={dispositivo.modelo}
                                            status={dispositivo.status}
                                            data={dispositivo.data_verificacao}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <p>Carregando dispositivos...</p>
                        )}

                        {/* Paginação */}
                        <div className={styles.paginationContainer}>
                            <div className={styles.pagination}>
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => paginate(index + 1)}
                                        className={styles.paginationButton}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Laboratories;
