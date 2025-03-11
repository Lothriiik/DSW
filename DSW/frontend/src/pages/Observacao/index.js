import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './Observacao.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import CircleButton from '../../components/CircleButton/CircleButton';
import CardObservacaoDisp from '../../components/CardObservacaoDisp/CardObservacaoDisp';
import CardObservacaoLab from '../../components/CardObservacaoLab/CardObservacaoLab';
import PopUpDelete from '../../components/PopUpDelete/PopUpDelete';
import CustomInput from '../../components/CustomInput/CustomInput';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
};

function Observacao() {
  const [observacoes, setObservacoes] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState('');
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const [showDeletePopUp, setShowDeletePopUp] = useState(false); 
  const [observacaoToDelete, setObservacaoToDelete] = useState(null); 
  const location = useLocation();

  const handleAdd = () => {
    navigate('/observacaoadd');
  };
  
  const handleEdit = (idObs) => {
    navigate('/observacaoedit', { state: { obsId: idObs } });
    };
  
  const handleView = (idObs) => {
      navigate('/observacaoview', { state: { obsId: idObs } });
      };

  const handleDelete = (id) => {
      setObservacaoToDelete(id);
      setShowDeletePopUp(true);
  };

  useEffect(() => {
    if (location.state?.nomeSala) {
      setFilterText(location.state.nomeSala);
    }
  }, [location.state]);


  useEffect(() => {
    
    const fetchObservacoes = async () => {
      try {
        const csrfToken = getCookie('csrftoken');
        const response = await axios.get('http://127.0.0.1:8000/api/problemas/obs-list/');
        console.log('Todas as observações:', response.data);
        setObservacoes(response.data.Observacao);
      } catch (error) {
        if (error.response) {
          console.log('Erro ao listar as observações:', error.response.data);
        } else {
          console.log('Erro de rede ou outro:', error);
        }
      }
    };
    fetchObservacoes();
  }, []);

  const confirmDelete = async () => {
    try {
        const csrfToken = getCookie('csrftoken');
        await axios.delete(`http://127.0.0.1:8000/api/problemas/obs-delete/?id_observacao=${observacaoToDelete}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'X-CSRFToken': csrfToken,
            }
        });
        setObservacoes(prevData => prevData.filter(observacao => observacao.id_observacao !== observacaoToDelete));
        setShowDeletePopUp(false); 
    } catch (error) {
        setError("Erro ao excluir observacao: " + (error.response?.data?.detail || error.message));
    }
  };

  const filteredObservacoes = observacoes.filter((observacao) => {
    return observacao.nome_sala.toLowerCase().includes(filterText.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredObservacoes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(observacoes.length / itemsPerPage);

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
            <h1 className={styles.headerTitle}>Observações</h1> 
            <div className={styles.controlsContainer}>
              <div className={styles.deviceInputContainer}>
                <span className={styles.deviceInfo}>Observações: {filteredObservacoes.length}</span>
                  <CustomInput
                    placeholder={`Pesquisar por ${'Sala'}`}
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

            <div className={styles.containerCard}>
              {currentItems.map((observacoes) =>
                observacoes.tipo === "Laboratorio" ? (
                  <CardObservacaoLab
                    key={observacoes.id_observacao}
                    sala={observacoes.nome_sala}
                    solicitante={observacoes.nome_usuario}
                    descricao={observacoes.descricao_dispositivo}
                    data={observacoes.data}
                    observacao={observacoes.observacao}
                    onClickEditar={() => handleEdit(observacoes.id_observacao)}
                    onClickDeletar={() => handleDelete(observacoes.id_observacao)} 
                    onClickCard={() => handleView(observacoes.id_observacao)}
                  />
                ) : (
                  <CardObservacaoDisp
                    key={observacoes.id_observacao}
                    sala={observacoes.nome_sala}
                    solicitante={observacoes.nome_usuario}
                    tipo={observacoes.tipo_dispositivo}
                    descricao={observacoes.descricao_dispositivo}
                    patrimonio={observacoes.patrimonio_dispositivo}
                    data={observacoes.data}
                    observacao={observacoes.observacao}
                    onClickEditar={() => handleEdit(observacoes.id_observacao)}
                    onClickDeletar={() => handleDelete(observacoes.id_observacao)} 
                    onClickCard={() => handleView(observacoes.id_observacao)}
                  />
                )
              )}
            </div>
            
            
            <div className={styles.paginationContainer}>
              <div className={styles.pagination}>
                {renderPaginationButtons()}
              </div>
            </div>
          </div>
        </div>
      </section>
              {showDeletePopUp && (
                                    <PopUpDelete
                                        onConfirm={confirmDelete}
                                        onClose={() => setShowDeletePopUp(false)}
                                        text={'observação'}
                                    />
                                )}
    </main>
  );
}

export default Observacao;
