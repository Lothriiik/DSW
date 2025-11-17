import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles.css';
import CircleButton from '../../components/CircleButton/CircleButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import CardComputador from '../../components/CardComputador/CardComputador';
import CardDispositivos from '../../components/CardDispositivos/CardDispositivos';
import PopUpTableSoftware from '../../components/PopUpTableSoftware/PopUpTableSoftware';
import PopUpDelete from '../../components/PopUpDelete/PopUpDelete';
import Pagination from '../../components/Pagination/Pagination';
import { deleteDispositivo, fetchDispositivosByLab, fetchLaboratorioById } from '../../services/api';

function DispByLab() {
  const { idSala } = useParams();
  const [dispositivos, setDispositivos] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [labName, setLabName] = useState('');
  const [filterText, setFilterText] = useState('');
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupDispositivoId, setPopupDispositivoId] = useState('');
  const [showDeletePopUp, setShowDeletePopUp] = useState(false); 
  const [dispositivoToDelete, setDispositivoToDelete] = useState(null); 

  const getItemsPerPage = () => {
    if (window.innerWidth > 1550) {
      return 10; 
    } else {
      return 8; 
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

  const handleAdd = () => {
    navigate('/dispadd', { state: { deviceId: idSala } });
  };

  const handleObserver = () => {
    navigate('/observacao', { state: {nomeSala: labName}});
  }
  
  const handleEdit = (idDisp) => {
  navigate('/dispedit', { state: { dispId: idDisp } });
  };

  const handleView = (idDisp) => {
    navigate('/dispview', { state: { dispId: idDisp } });
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
        const [dispositivosData, labData] = await Promise.all([
          fetchDispositivosByLab(idSala),
          fetchLaboratorioById(idSala)
        ]);
        
        setDispositivos(dispositivosData);
        setLaboratorios(labData);
        setLabName(labData.nome);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar dados. Por favor, tente novamente.');
      }
    };

    fetchData();
  }, [idSala]);

  const confirmDelete = async () => {
    try {
      await deleteDispositivo(dispositivoToDelete);
      setDispositivos(prevData => prevData.filter(dispositivo => dispositivo.id_dispositivo !== dispositivoToDelete));
      setShowDeletePopUp(false);
      setError(null); 
      
    } catch (err) {
      setError("Erro ao excluir dispositivo: " + (err.response?.data?.detail || err.message));
    }
  };

  const filteredDispositivos = dispositivos.filter((dispositivo) => {
    return dispositivo.descricao.toLowerCase().includes(filterText.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDispositivos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDispositivos.length / itemsPerPage);

  return (
    <>
          <div className="header">
            <h1 className="headerTitle">{labName || idSala}</h1> 
            <div className="controlsContainer">
              <div className="deviceInputContainer">

                <span className="deviceInfo">
                  Dispositivos: {filteredDispositivos.length}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                  Observações: {laboratorios.observacoes}</span>

                <div className="containerInput">
                  <CustomInput
                  placeholder={`Pesquisar em ${labName || 'Sala'}`}
                  value={filterText} 
                  onChange={(e) => setFilterText(e.target.value)}
                  className={`$inputField input-field320`}
                />
                </div>
                
                <div className="addButton">

                  <CircleButton className='orange' iconType="obs" onClick={handleObserver}/>
                  <CircleButton iconType="add" onClick={handleAdd}/>
           
                </div>
              </div>
              
            </div>
          </div>

          <div className="formContainer">
            {error && <p>{error}</p>}

            {currentItems.length > 0 ? (
              <div className="containerCardLabAll">
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
                      onClickCard={() => handleView(dispositivo.id_dispositivo)}
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
                      onClickCard={() => handleView(dispositivo.id_dispositivo)}
                    />
                  );
                })}
              </div>
            ) : (
              <p></p>
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
    </>
  );
}

export default DispByLab;
