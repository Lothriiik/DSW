import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import {  Select, Input, DatePicker, 
          FormControl as AntdFormControl, 
          Form, Radio } from 'antd';
import axios from 'axios';
import Sidebar from '../../components/Sidebar/Sidebar';
import dayjs from 'dayjs';
import './styles.css';
import { Layout } from "antd";


const { Content } = Layout;


const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
};

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
  const navigate = useNavigate();
  const location = useLocation();
  const { obsId } = location.state || {};
  const obsIdNumber = parseInt(obsId, 10)
  const [form] = Form.useForm();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleDateChange = (value) => {
    const formattedDate = value.format('YYYY-MM-DD');
    setData(formattedDate);
  };

  const checkFields = () => {
    const tipo = form.getFieldValue("tipo");
    const data = form.getFieldValue("data");
    const sala = form.getFieldValue("sala");
    const observações = form.getFieldValue("observações");

    setIsButtonDisabled(!(sala && tipo && observações && data));

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
    const fetchObsData = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/problemas/obs-by-id/?id_observacao=${obsIdNumber}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
            console.log(response);
            const observacao = response.data.observacao[0];

            form.setFieldsValue({
                          sala: observacao.id_sala || null,
                          tipo: observacao.tipo && observacao.tipo !== 'Dispositivo' ? 'Laboratorio' : observacao.tipo || '',
                          dispositivo: observacao.id_dispositivo || '',
                          observações: observacao.observacao,
                          usuario: observacao.id_usuario,
                          data: dayjs(observacao.data, "YYYY-MM-DD" )
            
                        });
            
            setIdSala(observacao.id_sala);
            setIdDisp(observacao.id_dispositivo);
            setObservacao(observacao.observacao);
            setTipo(observacao.tipo);
            setData(observacao.data);
            setIdUsuario(observacao.id_usuario);
            setIsLaboratorio(observacao.tipo === "Laboratorio");

       
        } catch (error) {
            setError('Erro ao carregar dados do dispositivo.');
        }
    };

    fetchObsData();
  }, [obsIdNumber]);

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/laboratorios/lab-list/');
        const data = response.data.Laboratorio;
        const formattedSalas = data.map((sala) => ({
        value: sala.id_sala,
        label: `${sala.nome} - ${sala.sala_ou_bloco}`,
        }));
        setSalas(formattedSalas);
      } catch (error) {
        console.error('Erro ao buscar as salas:', error);
      }
    };

    fetchSalas();
  
}, []);

  const fetchDispositivos = async (salaId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/laboratorios/disp-by-lecc/`, {
        params: { id_sala: salaId },
      });
      
      const data = response.data.Dispositivos;
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
    <Layout style={{ minHeight: "100vh" }}>
            <Sidebar />
            <Layout>
            <Content
              className='contentAll'
            >
    
              <div className='headerLabAdd'>
                <h1 className='headerTitleLabAdd'>Visualizar Observação</h1>
              </div>
              <div className='addDiv'>
    
                <Form 
                            form={form}
                            layout="vertical" 
                            onValuesChange={checkFields}
                            initialValues={{ 
                              sala: idSala || null ,
                              tipo: value ,
                              dispositivo: idDisp,
                            }}
                            > 
    
                <div style={{ marginTop:"15px" ,marginBottom: "15px" ,display : 'flex' , gap: '35px' , alignItems: "center" , justifyContent: 'space-between'}}>
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
    
                <div style={{ marginTop:"15px", marginBottom: "15px", display : 'flex', gap: '30px', alignItems: "center", justifyContent: 'space-between'}}>
                    
                    
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
                          labelCol={{ span: 6 }}  
                          wrapperCol={{ span: 18 }}
                          rules={[{ required: true, message: "Selecione o Status" }]}
                      >
                        <Select
                            className='customSelect'
                            placeholder="Dispositivo"
                            style={{
                              color: '#4F4F4F',
                              border: '1px solid #BDBDBD', 
                              borderradius: '4px ',
                              width: 270,
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
    
                <div style={{ marginTop:"15px", marginBottom: "15px", display : 'flex', gap: '30px', alignItems: "center", justifyContent: 'space-between'}}>
    
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
                          style={{
                            width: 416,
                            height: 172,
                            resize: 'none',
                             pointerEvents: 'none' 
                          }}
                        /> 
                        </Form.Item>
                    </div>  
                </div>
                </Form>         
                
              </div>
            </Content>
          </Layout>
        </Layout>
  );
}

export default ObservacaoView;
