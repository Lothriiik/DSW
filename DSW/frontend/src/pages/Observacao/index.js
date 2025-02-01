import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Observacao.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import CircleButton from '../../components/CircleButton/CircleButton';
import CardObservacaoDisp from '../../components/CardObservacaoDisp/CardObservacaoDisp';
import CardObservacaoLab from '../../components/CardObservacaoLab/CardObservacaoLab';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
};

function Observacao() {
  const { idObs } = useParams();
  const [observacoes, setObservacoes] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [idSala, setIdSala] = useState('');
  const [idObservacao, setIdObservacao] = useState('');
  const [idUsuario, setIdUsuario] = useState('');
  const [idDisp, setIdDisp] = useState('');
  const [observacao, setObservacao] = useState('');
  const [tipo, setTipo] = useState('');
  const [data, setData] = useState(null);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate('/observacaoadd');
  };
  


  useEffect(() => {

    const updateObservacaoStatus = async (observacaoId, statusData) => {
      try {
        const csrfToken = getCookie('csrftoken');
        const response = await axios.patch(`http://127.0.0.1:8000/api/problemas/obs-update/${observacaoId}/`, statusData
          , {
            headers: {
              'X-CSRFToken': csrfToken, 
            }
          });
        console.log('Observação atualizada com sucesso:', response.data);
      } catch (error) {
        if (error.response) {
          console.log('Erro ao atualizar a observação:', error.response.data);
        } else {
          console.log('Erro de rede ou outro:', error);
        }
      }
    };
    
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = observacoes.slice(indexOfFirstItem, indexOfLastItem);
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

    </main>
  );
}

export default Observacao;
