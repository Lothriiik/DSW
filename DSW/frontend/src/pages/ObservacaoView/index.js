import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import {  Select, Input, DatePicker, 
          Form, Radio } from 'antd';
import dayjs from 'dayjs';
import './styles.css';
import { fetchSalas, fetchDispositivosBySala, fetchObservacaoById, updateObservacao } from '../../services/api';

function ObservacaoView() {
  const [idSala, setIdSala] = useState('');
  const [idUsuario, setIdUsuario] = useState('');
  const [idDisp, setIdDisp] = useState('');
  const [observacao, setObservacao] = useState('');
  const [tipo, setTipo] = useState('');
  const [data, setData] = useState(null);
  const [value, setValue] = React.useState('');
  const [isLaboratorio, setIsLaboratorio] = useState(null);
  const [error, setError] = useState(null); 
  const [salas, setSalas] = useState([]); 
  const [dispositivos, setDispositivos] = useState([]); 
  const location = useLocation();
  const { obsId } = location.state || {};
  const obsIdNumber = parseInt(obsId, 10)
  const [form] = Form.useForm();

  const handleDateChange = (value) => {
    const formattedDate = value.format('YYYY-MM-DD');
    setData(formattedDate);
  };

  useEffect(() => {
    if (idSala) {
      fetchDispositivos(idSala);
    }
  }, [idSala]);

  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    setValue(selectedValue);
    setTipo(selectedValue);
    if (selectedValue === 'Laboratorio') {
      setIsLaboratorio(true);
    }
    else{
      setIsLaboratorio(false);
    }
  };

  const handleSalaChange = (selectedOption) => {
    setIdSala(selectedOption);
    fetchDispositivos(selectedOption);
  };

  const handleDispositivoChange = (selectedOption) => {
    setIdDisp(selectedOption);  
  };
  
  const { TextArea } = Input;

  useEffect(() => {
    const carregarDadosDaObservacao = async () => {
      try {
        const observacao = await fetchObservacaoById(obsIdNumber);

        form.setFieldsValue({
          sala: observacao.id_sala || null,
          tipo: observacao.tipo && observacao.tipo !== 'Dispositivo' ? 'Laboratorio' : observacao.tipo || '',
          dispositivo: observacao.id_dispositivo || '',
          observações: observacao.observacao,
          usuario: observacao.id_usuario,
          data: dayjs(observacao.data, "YYYY-MM-DD")
        });
        
        setIdSala(observacao.id_sala);
        setIdDisp(observacao.id_dispositivo);
        setObservacao(observacao.observacao);
        setTipo(observacao.tipo);
        setData(observacao.data);
        setIdUsuario(observacao.id_usuario);
        setIsLaboratorio(observacao.tipo === "Laboratorio");
      } catch (error) {
        setError('Erro ao carregar dados da observação.');
      }
    };
    carregarDadosDaObservacao();
  }, [obsIdNumber]);

  useEffect(() => {
    const carregarSalas = async () => {
      try {
        const salasFormatadas = await fetchSalas();
        setSalas(salasFormatadas);
      } catch (err) {
      console.error("Erro ao carregar salas:", err);
      setError("Não foi possível carregar as salas. Tente novamente mais tarde.");
      }
    };
    carregarSalas();
  }, []);

  const fetchDispositivos = async (salaId) => {
    try {
      const data = await fetchDispositivosBySala(salaId);
      const formattedDispositivos = data.map((dispositivo) => ({
        value: dispositivo.id_dispositivo,
        label: `${dispositivo.tipo} ${dispositivo.descricao}`,
      }));

      setDispositivos(formattedDispositivos);
    } catch (error) {
      console.error('Erro ao buscar os dispositivos:', error);
    }
  };

  return (
    <>
      <div className='headerAdd'>
        <h1 className='headerTitleAdd'>Visualizar Observação</h1>
      </div>
      <div className='addDiv'>
        <Form 
          form={form}
          layout="vertical" 
          initialValues={{ 
            sala: idSala || null ,
            tipo: value ,
            dispositivo: idDisp,
          }}
          > 

          <div className="wrap-group">
          <div className='tipoContainerObs'>
            <div className='radioContainerObs'>

            <Form.Item label="Tipo" name="tipo" >
                <Radio.Group
                  size='large'
                  buttonStyle="solid"
                  onChange={handleRadioChange}
                  style={{ display: "flex", gap: "20px", pointerEvents: 'none' }}
                  className="custom-radio"
                >
                  <Radio.Button value="Dispositivo">Dispositivo</Radio.Button>
                  <Radio.Button value="Laboratorio">Laboratorio</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="wrap-group">
          <div className="select-container">
            <Form.Item  
                label="Sala" 
                name="sala" 
                labelCol={{ span: 6 }}  
                wrapperCol={{ span: 18 }}
                rules={[{ required: true, message: "Selecione a Sala" }]}
            >
              <Select
                  className='customSelect'
                  placeholder="Sala"
                  style={{
                    color: '#4F4F4F',
                    border: '1px solid #BDBDBD', 
                    borderradius: '4px ',
                    width: 270,
                    height: 50,
                    fontSize: 'clamp(10px, 2vw, 14px)',
                      pointerEvents: 'none' 

                  }}
                  onChange={handleSalaChange}
                  options={salas}
              />
            </Form.Item>
          </div>

          <div className="select-container">
            <Form.Item  
                  label="Dispositivo" 
                  name="dispositivo" 
                  labelCol={{ span: 8 }}  
                  wrapperCol={{ span: 18 }}
                  rules={[{ required: true, message: "Selecione o Dispositivo" }]}
              >
                <Select
                    className='customSelect'
                    placeholder="Dispositivo"
                    style={{
                      color: '#4F4F4F',
                      border: '1px solid #BDBDBD', 
                      borderradius: '4px ',
                      width: 290,
                      height: 50,
                      fontSize: 'clamp(10px, 2vw, 14px)', 
                      pointerEvents: 'none' 

                    }}
                    disabled={isLaboratorio}
                    onChange={handleDispositivoChange}
                    options={dispositivos}
                />
              </Form.Item>
            </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "250px" }}>
              <Form.Item  
                label="Data" 
                name="data" 
                rules={[{ required: true, message: "Selecione a Data" }]}
                labelCol={{ span: 6 }}  
                wrapperCol={{ span: 18 }}

              >
                <DatePicker 
                  onChange={handleDateChange} 
                  format="YYYY-MM-DD" 
                  placeholder="Escolha a data"
                  style={{
                    width: "200PX",
                    height: "50px",
                    borderRadius: "4px",
                    border: "1px solid #BDBDBD",
                    fontSize: "clamp(14px, 2vw, 16px)",
                    pointerEvents: 'none' 
                  }}
                />
              </Form.Item>
            </div>
        </div>
        <div className="wrap-group-data">
          <div className="select-container">
              <Form.Item  
                label="Observações" 
                name="observações" 
                labelCol={{ span: 6 }}  
                wrapperCol={{ span: 18 }}

              >
                <TextArea 
                  rows={7} 
                  placeholder="Observações" 
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  className='textInput'
                  style={{
                    pointerEvents: 'none'
                  }}

                /> 
                </Form.Item>
            </div>  
        </div>
        </Form>         
      </div>
    </>
  );
}

export default ObservacaoView;
