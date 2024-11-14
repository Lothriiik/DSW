import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Importando useParams
import axios from 'axios';
import styles from './DispByLab.module.css';
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

function DispByLab() {
  const { idSala } = useParams();
  const [dispositivos, setDispositivos] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [labName, setLabName] = useState('');
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const csrfToken = getCookie('csrftoken');
        
        const dispositivosResponse = await axios.get(`http://127.0.0.1:8000/api/disp-by-lecc/?id_sala=${idSala}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'X-CSRFToken': csrfToken,
          }
        });
        setDispositivos(dispositivosResponse.data.Dispositivos);
        
        const labResponse = await axios.get(`http://127.0.0.1:8000/api/lab-by-id/?id_sala=${idSala}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'X-CSRFToken': csrfToken,
          }
        });

        const nomeSala = labResponse.data.laboratorio[0].nome;
        setLabName(nomeSala);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setError('Erro ao carregar dados');
      }
    };

    fetchData();
  }, [idSala]); 

  const filteredDispositivos = dispositivos.filter((dispositivo) => {
    return dispositivo.descricao.toLowerCase().includes(filterText.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDispositivos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDispositivos.length / itemsPerPage);

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

      if (currentPage < totalPages - 2) {
        buttons.push(<span key="ellipsis-end">...</span>);
      }

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

  return (
    <main className={styles.Laboratories}>
      <section className={styles.principal}>
        <Sidebar />
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h1 className={styles.headerTitle}>{labName || idSala}</h1> 
            <div className={styles.controlsContainer}>
              <div className={styles.deviceInputContainer}>
                <span className={styles.deviceInfo}>Dispositivos: {filteredDispositivos.length}</span>
                <CustomInput
                  placeholder={`Pesquisar em ${labName || 'Sala'}`}
                  value={filterText} 
                  onChange={(e) => setFilterText(e.target.value)}
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
                      tipo={dispositivo.descricao}
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
                {renderPaginationButtons()}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DispByLab;
