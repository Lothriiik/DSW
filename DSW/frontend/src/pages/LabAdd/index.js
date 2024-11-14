import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './LabAdd.module.css';
import Sidebar from '../../components/Sidebar';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import CircleButton from '../../components/CircleButton';
import Calendary from '../../components/Calendary'; 


const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
};

function LabAdd() {
  const [inputMarca, setInputMarca] = useState('');
  const [inputModelo, setInputModelo] = useState('');
  const [inputPatrimonio, setInputPatrimonio] = useState('');
  const [configuracao, setConfiguracao] = useState(''); 
  const [descricao, setDescricao] = useState(''); 
  const [isComputador, setIsComputador] = useState(true); 
  const [data, setData] = useState(''); 
  const [showCalendar, setShowCalendar] = useState(false); 
  const [error, setError] = useState(null); 

  
  const handleDateSelect = (selectedDate) => {
    setData(selectedDate);
    setShowCalendar(false);
  };

  
  const handleSave = async () => {
    try {
      const csrfToken = getCookie('csrftoken');
      await axios.post(`http://127.0.0.1:8000/api/lab-create/`, {
        id_dispositivo: 2,
        id_sala: 1,
        marca: inputMarca,
        modelo: inputModelo,
        patrimonio: inputPatrimonio,
        is_computador: isComputador,
        configuracao: configuracao,
        descricao: descricao,
        status: "Funcionando",
        data_verificacao: data,
      }, {
        headers: {
          'X-CSRFToken': csrfToken, 
        }
      });
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      setError('Erro ao salvar dados');
    }
  };

  return (
    <main className={styles.Laboratories}>
      <section className={styles.principal}>
        <Sidebar />
        <div className={styles.mainContent}>
          <h1>Adicionar Dispositivo</h1>
          <div className={styles.formContainer}>
            {error && <p>{error}</p>}


            <CustomInput
              placeholder="Marca"
              value={inputMarca}
              onChange={(e) => setInputMarca(e.target.value)}
              className="input-field320"
            />


            <CustomInput
              placeholder="Modelo"
              value={inputModelo}
              onChange={(e) => setInputModelo(e.target.value)}
              className="input-field320"
            />


            <CustomInput
              placeholder="Patrimônio"
              value={inputPatrimonio}
              onChange={(e) => setInputPatrimonio(e.target.value)}
              className="input-field320"
            />


            <div className={styles.dateInputContainer}>
              <CustomInput
                placeholder="Data de Verificação"
                value={data}
                readOnly
                onClick={() => setShowCalendar(!showCalendar)}
                className="input-field320"
              />
              <CircleButton iconType="calendar" onClick={() => setShowCalendar(!showCalendar)} />
              {showCalendar && <Calendary onDateSelect={handleDateSelect} />}
            </div>

            {/* Tipo de dispositivo (Computador ou Outro) */}
            <div className={styles.radioContainer}>
              <label>
                <input
                  type="radio"
                  name="tipo"
                  checked={isComputador}
                  onChange={() => setIsComputador(true)}
                />
                Computador
              </label>
              <label>
                <input
                  type="radio"
                  name="tipo"
                  checked={!isComputador}
                  onChange={() => setIsComputador(false)}
                />
                Outro
              </label>
            </div>

            {/* Campo de Configuração */}
            <CustomInput
              placeholder="Configuração"
              value={configuracao}
              onChange={(e) => setConfiguracao(e.target.value)}
              className="input-field320"
            />

            {/* Campo Descrição */}
            <CustomInput
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="input-field320"
            />

            {/* Botão de Salvar */}
            <CustomButton onClick={handleSave} label="Salvar" className="blue size138"></CustomButton>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LabAdd;
