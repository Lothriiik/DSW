import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './DispByLab.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import CircleButton from '../../components/CircleButton/CircleButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import CardComputador from '../../components/CardComputador/CardComputador';
import CardDispositivos from '../../components/CardDispositivos/CardDispositivos';
import PopUpTableSoftware from '../../components/PopUpTableSoftware/PopUpTableSoftware';
import PopUpDelete from '../../components/PopUpDelete/PopUpDelete';

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
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupDispositivoId, setPopupDispositivoId] = useState('');
  const [showDeletePopUp, setShowDeletePopUp] = useState(false); 
  const [dispositivoToDelete, setDispositivoToDelete] = useState(null); 

  const handleAdd = () => {
    navigate('/LabDispAdd', { state: { deviceId: idSala } });
  };
  
  const handleEdit = (idDisp) => {
  navigate('/LabDispEdit', { state: { dispId: idDisp } });
  };

  const handleOpenPopup = (idDispositivo) => {
    setIsPopupOpen(true);
    setPopupDispositivoId(idDispositivo)
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleDelete = (id) => {
    setDispositivoToDelete(id);
    setShowDeletePopUp(true);
  };

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

  const confirmDelete = async () => {
    try {
        const csrfToken = getCookie('csrftoken');
        await axios.delete(`http://127.0.0.1:8000/api/disp-delete/?id_dispositivo=${dispositivoToDelete}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'X-CSRFToken': csrfToken,
            }
        });
        setDispositivos(prevData => prevData.filter(dispositivos => dispositivos.id_dispositivo !== dispositivoToDelete));
        setShowDeletePopUp(false); 
    } catch (error) {
        setError("Erro ao excluir dispositivo: " + (error.response?.data?.detail || error.message));
    }
  };


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
        buttons.push(<span className={styles['ellipsis-pagination']} key="ellipsis-start">...</span>);
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
        buttons.push(<span className={styles['ellipsis-pagination']} key="ellipsis-end">...</span>);
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
                <CircleButton iconType="add" onClick={handleAdd}/>
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
                      onClickEditar={() => handleEdit(dispositivo.id_dispositivo)}
                      onClickSoftware={() => handleOpenPopup(dispositivo.id_dispositivo)}
                      onClickDeletar={() => handleDelete(dispositivo.id_dispositivo)} 
                    />
                  ) : (
                    <CardDispositivos
                      key={dispositivo.id_dispositivo}
                      tipo={dispositivo.tipo}
                      patrimonio={dispositivo.patrimonio}
                      modelo={dispositivo.modelo}
                      status={dispositivo.status}
                      data={dispositivo.data_verificacao}
                      onClickEditar={() => handleEdit(dispositivo.id_dispositivo)}
                      onClickDeletar={() => handleDelete(dispositivo.id_dispositivo)} 
                    />
                  );
                })}
              </div>
            ) : (
              <p></p>
            )}
            
            <div className={styles.paginationContainer}>
              <div className={styles.pagination}>
                {renderPaginationButtons()}
              </div>
            </div>
          </div>
        </div>
      </section>
      {isPopupOpen && (
        <PopUpTableSoftware
          idDispositivo={popupDispositivoId}
          closePopup={closePopup}
        />
      )}
      {showDeletePopUp && (
                      <PopUpDelete
                          onConfirm={confirmDelete}
                          onClose={() => setShowDeletePopUp(false)}
                          text={'dispositivo'}
                      />
                  )}
    </main>
  );
}

export default DispByLab;
