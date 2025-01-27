import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Laboratories.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import CardLECC from '../../components/CardLECC/CardLECC';
import CircleButton from '../../components/CircleButton/CircleButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import PopUpDelete from '../../components/PopUpDelete/PopUpDelete';
import LabCreatePopUp from '../../components/LabCreatePopUp/LabCreatePopUp'
import LabEditPopUp from '../../components/LabEditPopUp/LabEditPopUp'

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

function Laboratories() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [laboratorios, setLaboratorios] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false); 
  const [laboratorioToDelete, setLaboratorioToDelete] = useState(null); 
  const [editLabPopup, setEditLabPopup] = useState({ isOpen: false, laboratorio: null });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState('');
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const csrfToken = getCookie('csrftoken');
        const response = await axios.get(`http://127.0.0.1:8000/api/lab-list/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'X-CSRFToken': csrfToken,
          }
        });
        setLaboratorios(response.data.Laboratorio || []);
        console.log("Laboratórios recebidos:", response.data.Laboratorio);
      } catch (error) {
        console.error("Erro ao carregar Laboratórios:", error);
        setError('Erro ao carregar Laboratórios');
      }
    };

    const fetchDispositivos = async () => {
      try {
        const csrfToken = getCookie('csrftoken');
        const response = await axios.get(`http://127.0.0.1:8000/api/disp-list/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'X-CSRFToken': csrfToken,
          }
        });
        setDispositivos(response.data.dispositivos || []);
        
      } catch (error) {
        console.error("Erro ao carregar Dispositivos:", error);
        setError('Erro ao carregar Dispositivos');
      }
    };

    fetchData();
    fetchDispositivos();
  }, []);

  const handleDelete = (id) => {
    setLaboratorioToDelete(id);
    setShowDeletePopUp(true);
  };

  const confirmDelete = async () => {
    try {
        const csrfToken = getCookie('csrftoken');
        await axios.delete(`http://127.0.0.1:8000/api/lab-delete/?id_sala=${laboratorioToDelete}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'X-CSRFToken': csrfToken,
            }
        });
        setLaboratorios(prevData => prevData.filter(laboratorios => laboratorios.id_sala !== laboratorioToDelete));
        setShowDeletePopUp(false); 
    } catch (error) {
        setError("Erro ao excluir laboratorio: " + (error.response?.data?.detail || error.message));
    }
  };

  const filteredLaboratorio = laboratorios.filter((laboratorios) =>
    laboratorios.nome.toLowerCase().includes(filterText.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLaboratorio.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLaboratorio.length / itemsPerPage);

  

  const openEditPopup = (laboratorio) => {
    setEditLabPopup({ isOpen: true, laboratorio });
  };

  const closeEditPopup = () => {
    setEditLabPopup({ isOpen: false, laboratorio: null });
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

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <main className={styles.Laboratories}>
      <section className={styles['principal']}>
        <Sidebar />
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h1 className={styles.headerTitle}>Laboratórios</h1>
            <div className={styles.controlsContainer}>
              <div className={styles.deviceInputContainer}>
                <span className={styles.deviceInfo}>
                  Laboratórios: {filteredLaboratorio.length} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                  Dispositivos: {dispositivos.length}
                </span>
                <CustomInput
                  placeholder="Pesquisar por Laboratório"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className={`${styles.inputField} input-field320`}
                />
              </div>
              <>
                <div className={styles.addButton}>
                  <CircleButton iconType="add" onClick={openPopup} />
                  {isPopupOpen && <LabCreatePopUp closePopup={closePopup} />}
                </div>

              </>
            </div>
          </div>
          <div className={styles['formContainer']}>
            <div className={styles.containerCard}>
              {currentItems.map((laboratorios) => (
                <CardLECC
                  key={laboratorios.id}
                  sala={laboratorios.sala_ou_bloco}
                  lab={laboratorios.nome}
                  numdisp={laboratorios.numdisp}
                  onClickDelete={() => handleDelete(laboratorios.id_sala)} 
                  onClickEdit={() => openEditPopup(laboratorios.id_sala)}
                  onClickCard={() => navigate(`/laboratorio/${laboratorios.id_sala}`)}
                />
              ))}
            </div>

            {editLabPopup.isOpen && (
              <LabEditPopUp
                closePopup={closeEditPopup}
                labId={editLabPopup.laboratorio}
              />
            )}

            {showDeletePopUp && (
                <PopUpDelete
                    onConfirm={confirmDelete}
                    onClose={() => setShowDeletePopUp(false)}
                    text={'laboratorio'}
                />
            )}

            <div className={styles.paginationContainer}>
              <div className={styles.pagination}>{renderPaginationButtons()}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Laboratories;
