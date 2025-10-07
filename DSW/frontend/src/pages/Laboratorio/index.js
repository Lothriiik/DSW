import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import CardLECC from '../../components/CardLECC/CardLECC';
import CircleButton from '../../components/CircleButton/CircleButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import PopUpDelete from '../../components/PopUpDelete/PopUpDelete';
import LabCreatePopUp from '../../components/LabCreatePopUp/LabCreatePopUp'
import LabEditPopUp from '../../components/LabEditPopUp/LabEditPopUp'
import { fetchDispositivos, fetchLaboratorios, deleteLaboratorio } from '../../services/api';
import Pagination from '../../components/Pagination/Pagination';

function Laboratorio() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [laboratorios, setLaboratorios] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false); 
  const [laboratorioToDelete, setLaboratorioToDelete] = useState(null); 
  const [editLabPopup, setEditLabPopup] = useState({ isOpen: false, laboratorio: null });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState('');
  const navigate = useNavigate();

  const getItemsPerPage = () => {
  if (window.innerWidth > 1550) {
    return 8; 
  } else {
    return 6; 
  }
  };
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage()); 

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [labsData, dispData] = await Promise.all([
          fetchLaboratorios(),
          fetchDispositivos()
        ]);
        
        setLaboratorios(labsData || []);
        setDispositivos(dispData || []);
        setError(null);
        
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError('Erro ao carregar os dados.');
      }
    };
    
    fetchData();
  }, []);

  const handleDelete = (id) => {
    setLaboratorioToDelete(id);
    setShowDeletePopUp(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteLaboratorio(laboratorioToDelete);
      setLaboratorios(prevData => prevData.filter(lab => lab.id_sala !== laboratorioToDelete));
      setShowDeletePopUp(false);
      setError(null);
      
    } catch (err) {
      console.error("Erro ao excluir laboratório:", err);
      setError("Erro ao excluir laboratório: " + (err.response?.data?.detail || err.message));
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

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
          <>
          <div className="header">
            <h1 className="headerTitle">Laboratórios</h1>
            <div className="controlsContainer">
              <div className="deviceInputContainer">
                <span className="deviceInfo">
                  Laboratórios: {filteredLaboratorio.length} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                  Dispositivos: {dispositivos.length}
                </span>

                
                <div className="containerInput">
                  <CustomInput
                  placeholder="Pesquisar por Laboratório"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className={`$inputField input-field320`}
                />
                </div>
                <div className="addButton">
                  <CircleButton iconType="add" onClick={openPopup} />
                  {isPopupOpen && <LabCreatePopUp closePopup={closePopup} />}
                </div>
              </div>
            </div>
          </div>
          <div className="formContainer">
            <div className="containerCardLab">
              {currentItems.map((laboratorios) => (
                <CardLECC
                  key={laboratorios.id}
                  sala={laboratorios.sala_ou_bloco}
                  lab={laboratorios.nome}
                  numdisp={laboratorios.numdisp}
                  onClickDelete={() => handleDelete(laboratorios.id_sala)} 
                  onClickEdit={() => openEditPopup(laboratorios.id_sala)}
                  onClickCard={() => navigate(`/dispbylab/${laboratorios.id_sala}`)}
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

            <div className="paginationContainer">
              <div className="pagination">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage} 
                />
              </div>
            </div>
          </div>
          </>
  );
}

export default Laboratorio;
