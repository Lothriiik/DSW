import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles.css';
import CircleButton from '../../components/CircleButton/CircleButton';
import CardObservacaoDisp from '../../components/CardObservacaoDisp/CardObservacaoDisp';
import CardObservacaoLab from '../../components/CardObservacaoLab/CardObservacaoLab';
import PopUpDelete from '../../components/PopUpDelete/PopUpDelete';
import CustomInput from '../../components/CustomInput/CustomInput';
import Pagination from '../../components/Pagination/Pagination';
import { fetchObservacoes, deleteObservacao } from '../../services/api';

function Observacao() {
  const [observacoes, setObservacoes] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState('');
  const navigate = useNavigate();
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);
  const [observacaoToDelete, setObservacaoToDelete] = useState(null);
  const location = useLocation();

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
    const carregarObservacoes = async () => {
      try {
        const data = await fetchObservacoes();
        setObservacoes(data);

      } catch (error) {
        console.error('Erro ao carregar observações:', error);
      }
    };

    carregarObservacoes();
  }, []);

  const confirmDelete = async () => {
    try {
      await deleteObservacao(observacaoToDelete);
      setObservacoes(prevData => prevData.filter(obs => obs.id_observacao !== observacaoToDelete));
      setShowDeletePopUp(false);
      setError(null);

    } catch (err) {
      console.error("Erro ao excluir observação:", err);
      setError("Erro ao excluir observação: " + (err.response?.data?.detail || err.message));
    }
  };
  const filteredObservacoes = observacoes.filter((observacao) => {
    return observacao.nome_sala.toLowerCase().includes(filterText.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredObservacoes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(observacoes.length / itemsPerPage);

  return (
    <>
      <div className="header">
        <h1 className="headerTitle">Observações</h1>
        <div className="controlsContainer">
          <div className="deviceInputContainer">
            <span className="deviceInfo">Observações: {filteredObservacoes.length}</span>
            <div className="containerInput">
              <CustomInput
                placeholder={`Pesquisar por ${'Sala'}`}
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className={`$inputField input-field320`}
              />
            </div>
            <div className="addButton">
              <CircleButton iconType="add" onClick={handleAdd} />
            </div>
          </div>

        </div>
      </div>

      <div className="formContainer">
        {error && <p>{error}</p>}

        <div className="containerCard">
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

      {showDeletePopUp && (
        <PopUpDelete
          onConfirm={confirmDelete}
          onClose={() => setShowDeletePopUp(false)}
          text={'observação'}
        />
      )}
    </>
  );
}

export default Observacao;
