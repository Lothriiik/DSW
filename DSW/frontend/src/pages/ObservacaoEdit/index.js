import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import {  Select, Input, DatePicker, 
          FormControl as AntdFormControl, 
          Form, Button, Radio } from 'antd';
import axios from 'axios';
import Sidebar from '../../components/Sidebar/Sidebar';
import PopUpSucess from '../../components/PopUpSucess/PopUpSucess';
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

function ObservacaoEdit() {
  const [idSala, setIdSala] = useState('');
  const [idUsuario, setIdUsuario] = useState('');
  const [idDisp, setIdDisp] = useState('');
  const [observacao, setObservacao] = useState('');
  const [tipo, setTipo] = useState('');
  const [data, setData] = useState(null);
  const [value, setValue] = React.useState('');
  const [isLaboratorio, setIsLaboratorio] = useState(null);
  const [error, setError] = useState(null); 
  const [showSuccess, setShowSuccess] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [salas, setSalas] = useState([]); 
  const [dispositivos, setDispositivos] = useState([]); 
  const navigate = useNavigate();
  const location = useLocation();
  const { obsId } = location.state || {};
  const obsIdNumber = parseInt(obsId, 10)
  const [form] = Form.useForm();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 992);
    
    const handleResize = () => {
        setIsSmallScreen(window.innerWidth <= 992);
    };
  
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
  
  const handleSave = async () => {
    setIsLoading(true);
      try {
        const csrfToken = getCookie('csrftoken');
        const response = await axios.patch(`http://127.0.0.1:8000/api/problemas/obs-update/${obsIdNumber}/`, {
          id_sala: idSala,
          id_usuario: idUsuario,
          id_dispositivo: idDisp,
          observacao: observacao,
          tipo: tipo,
          data: data,
        }, {
            headers: {
              'X-CSRFToken': csrfToken, 
            }
          });
          setShowSuccess(true);
      } catch (error) {
        if (error.response) {
          console.log('Erro ao atualizar a observação:', error.response.data);
        } else {
          console.log('Erro de rede ou outro:', error);
        }
        }finally {
          setIsLoading(false);
      }
  };

  const handleSubmit = async () => {
    try {
      await handleSave();
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      setError('Erro ao salvar dados');
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
                <h1 className='headerTitleLabAdd'>Editar Observação</h1>
              </div>
              <div className='addDiv'>
    
                <Form 
                            form={form}
                            onFinish={handleSubmit} 
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
                          style={{ display: "flex", gap: "20px"}}
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
                            fontSize: "clamp(14px, 2vw, 16px)"
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
                          }}
                        /> 
                        </Form.Item>
                    </div>  
                </div>
    
                <div style={{ marginTop:"15px" ,marginBottom: "15px" ,display : 'flex' , gap: '30px' , justifyContent: 'end', alignItems: "flex-end"}}>
                    <div className="popup-actions-confirm">
                            {isLoading ? (
                                <svg width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="spinner">
                                    <path opacity="0.3" d="M25.5 42C26.6046 42 27.5 41.1046 27.5 40C27.5 38.8954 26.6046 38 25.5 38C24.3954 38 23.5 38.8954 23.5 40C23.5 41.1046 24.3954 42 25.5 42Z" fill="#0095DA"/>
                                    <path opacity="0.3" d="M33 40C34.1046 40 35 39.1046 35 38C35 36.8954 34.1046 36 33 36C31.8954 36 31 36.8954 31 38C31 39.1046 31.8954 40 33 40Z" fill="#0095DA"/>
                                    <path opacity="0.3" d="M18 40C19.1046 40 20 39.1046 20 38C20 36.8954 19.1046 36 18 36C16.8954 36 16 36.8954 16 38C16 39.1046 16.8954 40 18 40Z" fill="#0095DA"/>
                                    <path opacity="0.3" d="M38.5 34.5C39.6046 34.5 40.5 33.6046 40.5 32.5C40.5 31.3954 39.6046 30.5 38.5 30.5C37.3954 30.5 36.5 31.3954 36.5 32.5C36.5 33.6046 37.3954 34.5 38.5 34.5Z" fill="#0095DA"/>
                                    <path opacity="0.44" d="M12.5 34.5C13.6046 34.5 14.5 33.6046 14.5 32.5C14.5 31.3954 13.6046 30.5 12.5 30.5C11.3954 30.5 10.5 31.3954 10.5 32.5C10.5 33.6046 11.3954 34.5 12.5 34.5Z" fill="#0095DA"/>
                                    <path opacity="0.3" d="M40.5 27C41.6046 27 42.5 26.1046 42.5 25C42.5 23.8954 41.6046 23 40.5 23C39.3954 23 38.5 23.8954 38.5 25C38.5 26.1046 39.3954 27 40.5 27Z" fill="#0095DA"/>
                                    <path opacity="0.65" d="M10.5 27C11.6046 27 12.5 26.1046 12.5 25C12.5 23.8954 11.6046 23 10.5 23C9.39543 23 8.5 23.8954 8.5 25C8.5 26.1046 9.39543 27 10.5 27Z" fill="#0095DA"/>
                                    <path opacity="0.3" d="M38.5 19.5C39.6046 19.5 40.5 18.6046 40.5 17.5C40.5 16.3954 39.6046 15.5 38.5 15.5C37.3954 15.5 36.5 16.3954 36.5 17.5C36.5 18.6046 37.3954 19.5 38.5 19.5Z" fill="#0095DA"/>
                                    <path opacity="0.86" d="M12.5 19.5C13.6046 19.5 14.5 18.6046 14.5 17.5C14.5 16.3954 13.6046 15.5 12.5 15.5C11.3954 15.5 10.5 16.3954 10.5 17.5C10.5 18.6046 11.3954 19.5 12.5 19.5Z" fill="#0095DA"/>
                                    <path opacity="0.3" d="M33 14C34.1046 14 35 13.1046 35 12C35 10.8954 34.1046 10 33 10C31.8954 10 31 10.8954 31 12C31 13.1046 31.8954 14 33 14Z" fill="#0095DA"/>
                                    <path opacity="0.93" d="M18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12C16 13.1046 16.8954 14 18 14Z" fill="#0095DA"/>
                                    <path d="M25.5 12C26.6046 12 27.5 11.1046 27.5 10C27.5 8.89543 26.6046 8 25.5 8C24.3954 8 23.5 8.89543 23.5 10C23.5 11.1046 24.3954 12 25.5 12Z" fill="#0095DA"/>
                                </svg>
                            ) : (
                              <Form.Item>
                                <Button type="submit" htmlType="submit" disabled={isButtonDisabled} label="Salvar"  className="blue size138" >Salvar</Button>
                              </Form.Item> 
                            )}
                            {showSuccess && (
                            <PopUpSucess
                            onClose={() => navigate(`/observacao/`)}
                            text= 'Observação feita'
                            />
                            )}
                        </div>      
                    
                  </div>
                </Form>         
                
              </div>
            </Content>
          </Layout>
        </Layout>
  );
}

export default ObservacaoEdit;
