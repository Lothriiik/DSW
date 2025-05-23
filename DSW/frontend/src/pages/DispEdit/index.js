import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import {  Select, Input, DatePicker, 
        Form, Button, Radio } from 'antd';
import axios from 'axios';
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomButton from '../../components/CustomButton/CustomButton';
import PopUpSucess from '../../components/PopUpSucess/PopUpSucess';
import './styles.css';
import PopUpTableSoftware from '../../components/PopUpTableSoftware/PopUpTableSoftware';
import dayjs from "dayjs";
import { Layout } from "antd";


const { Content } = Layout;

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
};

function DispEdit() {
  const [inputTipo, setInputTipo] = useState('');
  const [inputModelo, setInputModelo] = useState('');
  const [inputIdsala, setInputIdsala] = useState('');
  const [inputPatrimonio, setInputPatrimonio] = useState('');
  const [inputConfiguracao, setInputConfiguracao] = useState(''); 
  const [inputDescricao, setInputDescricao] = useState(''); 
  const [isComputador, setIsComputador] = useState(true); 
  const [error, setError] = useState(null); 
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [radioTipo, setRadioTipo] = React.useState('computador');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [salas, setSalas] = useState([]); 
  const navigate = useNavigate();
  const location = useLocation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { dispId } = location.state || {};
  const dispIdNumber = parseInt(dispId, 10);
  const { TextArea } = Input;
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
  
  const checkFields = () => {
    const status = form.getFieldValue("status");
    const modelo = form.getFieldValue("modelo");
    const tipo = form.getFieldValue("tipo");
    const patrimonio = form.getFieldValue("patrimonio");
    const data = form.getFieldValue("data");
    const sala = form.getFieldValue("sala");
    setIsButtonDisabled(!(status && sala && modelo && tipo && patrimonio && data));
    console.log('1')
  };

  useEffect(() => {
    const fetchDispData = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/laboratorios/disp-by-id/?id_dispositivo=${dispIdNumber}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
            const dispositivo = response.data.Dispositivos[0];
            form.setFieldsValue({
              sala: dispositivo.id_sala || null,
              tipo: dispositivo.tipo && dispositivo.tipo.toLowerCase() !== 'computador' ? 'outro' : dispositivo.tipo.toLowerCase() || '',
              status: dispositivo.status || null,
              dispositivo: dispositivo.tipo || '',
              configuracao: dispositivo.configuracao,
              descricao: dispositivo.descricao,
              modelo: dispositivo.modelo,
              patrimonio: dispositivo.patrimonio,
              data: dayjs(dispositivo.data_verificacao, "YYYY-MM-DD" )

            });
            setInputIdsala(dispositivo.id_sala);
            setInputConfiguracao(dispositivo.configuracao);
            setInputDescricao(dispositivo.descricao);
            
            setInputModelo(dispositivo.modelo);
            setInputPatrimonio(dispositivo.patrimonio);
            setInputTipo(dispositivo.tipo);
            setIsComputador(dispositivo.is_computador);
            setSelectedDate(dispositivo.data_verificacao);
            setSelectedStatus(dispositivo.status);
            checkFields();
        } catch (error) {
            setError('Erro ao carregar dados do dispositivo.');
        }
    };

    fetchDispData();
  }, [dispIdNumber]);

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

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const csrfToken = getCookie('csrftoken');
      await axios.put(`http://127.0.0.1:8000/api/laboratorios/disp-update/${dispIdNumber}/`, {
        id_sala: inputIdsala,
        tipo: inputTipo,
        modelo: inputModelo,
        patrimonio: inputPatrimonio,
        is_computador: isComputador,
        configuracao: inputConfiguracao,
        descricao: inputDescricao,
        status: selectedStatus,
        data_verificacao: selectedDate,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'X-CSRFToken': csrfToken, 
        }
      });
      setShowSuccess(true);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      setError('Erro ao salvar dados');
    }finally {
      setIsLoading(false);
  }
  };

  const handleDateChange = (value) => {
    if (value) {
      const formattedDate = value.format('YYYY-MM-DD');
      setSelectedDate(formattedDate);
    } else {
      setSelectedDate(null);
    }
  };

  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    setRadioTipo(selectedValue);
    setIsComputador(selectedValue === 'computador');
    setInputTipo(selectedValue === 'computador' ? 'Computador' : '');
  }

  const handleStatusChange = (value) => {
    setSelectedStatus(value)
  };

  const handleSalaChange = (value) => {
    setInputIdsala(value);
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    if (inputTipo) {
      setRadioTipo(inputTipo.toLowerCase() === 'computador' ? 'computador' : 'outro');
    }
  }, [inputTipo]);

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
            <h1 className='headerTitleLabAdd'>Editar Dispositivo</h1>
          </div>
          <div className='addDiv'>
            <Form 
              form={form}
              onFinish={handleSubmit} 
              layout="vertical" 
              onValuesChange={checkFields}
              initialValues={{ 
                sala: parseInt(inputIdsala, 10) || null,
                tipo: radioTipo, 
                status: selectedStatus || null,
                dispositivo: inputTipo || '', 
              }}> 
                    <div style={{ marginTop:"15px", height:'105px', marginBottom: "30px", display : 'flex', gap: '35px', alignItems: "center", justifyContent: 'space-between'}}>
                      <div className='tipoContainer'>
                        <div className='radioContainer'>
                          
                        <Form.Item 
                        label="Tipo" name="tipo" 
                        >
                          <Radio.Group

                            value={radioTipo}
                            size='large'
                            buttonStyle="solid"
                            onChange={handleRadioChange}
                            style={{ display: "flex", gap: "20px"}}
                            className="custom-radio"
                          >
                            <Radio.Button value="computador">Computador</Radio.Button>
                            <Radio.Button value="outro">Outro</Radio.Button>
                          </Radio.Group>
                        </Form.Item>
                        </div>
                        
                      </div>
      
                      <Form.Item  
                        label="Dispositivo" 
                        name="dispositivo" 
                        rules={[{ required: true, message: "Digite o tipo de dispositivo!" }]}
      
                      >
                        <Input
                          placeholder="Tipo"
                          value={inputTipo}
                          onChange={(e) => setInputTipo(e.target.value)}
                          className="input-field27050"
                          disabled={isComputador}
                        />
                      </Form.Item>
      
                      <Form.Item  
                        label="Patrimonio" 
                        name="patrimonio" 
                        rules={[{ required: true, message: "Digite o Patrimonio" }]}
      
                      >
                        <Input
                          type="number"
                          placeholder="Patrimônio"
                          value={inputPatrimonio}
                          onChange={(e) => setInputPatrimonio(e.target.value)}
                          className="input-field27050"
                        />
                      </Form.Item>
      
                    </div>
      
                    <div style={{ marginTop:"15px", height:'105px' ,marginBottom: "30px" ,display : 'flex' , gap: '35px' , alignItems: "center" , justifyContent: 'space-between'}}>
                      <div className="select-container">
                        <Form.Item  
                            label="Status" 
                            name="status" 
                            labelCol={{ span: 6 }}  
                            wrapperCol={{ span: 18 }}
                            rules={[{ required: true, message: "Selecione o Status" }]}
                        >
                          <Select
                            
                            className='customSelect'
                            placeholder="Status"
                            style={{
                              color: '#4F4F4F',
                              border: '1px solid #BDBDBD', 
                              borderradius: '4px ',
                              width: 270,
                              height: 50,
                              fontSize: 'clamp(10px, 2vw, 14px)',
      
                            }}
                            onChange={handleStatusChange}
                            options={[
                              {
                                value: 'Funcionando',
                                label: 'Funcionando',
                              },
                              {
                                value: 'Com Defeito',
                                label: 'Com Defeito',  
                              },
                            ]}
                          />
                        </Form.Item>
                        
                      </div>
                      <div className="select-container">
                        <Form.Item  
                            label="Sala" 
                            name="sala" 
                            rules={[{ required: true, message: "Selecione a Sala" }]}
                            labelCol={{ span: 6 }}  
                            wrapperCol={{ span: 18 }}
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
      
                      <Form.Item  
                        label="Modelo" 
                        name="modelo" 
                        rules={[{ required: true, message: "Digite o Modelo" }]}
                        labelCol={{ span: 6 }}  
                        wrapperCol={{ span: 18 }}
      
                      >
                        <Input
                          placeholder="Modelo"
                          value={inputModelo}
                          onChange={(e) => setInputModelo(e.target.value)}
                          className="input-field27050"
                        />
                      </Form.Item>
      
                    </div>
                    
                    <div style={{ marginTop:"15px", marginBottom: "30px" ,display : 'flex' , gap: '30px' , alignItems: "center" , justifyContent: 'space-between'}}>
                      <div className="select-container">
                          <Form.Item  
                            label="Configurações" 
                            name="configurações" 
                            labelCol={{ span: 6 }}  
                            wrapperCol={{ span: 18 }}
      
                          >
                            <TextArea 
                              rows={7} 
                              placeholder="Configurações" 
                              value={inputConfiguracao}
                              onChange={(e) => setInputConfiguracao(e.target.value)}
                              style={{
                                width: 416,
                                height: 172,
                                border: '1px solid #BDBDBD',
                                borderRadius: '4px',
                                resize: 'none',
                              }}
                            /> 
                          </Form.Item>
                        
                      </div>        
                      
                      <div className="select-container">
                      <Form.Item  
                            label="Descrição" 
                            name="descrição" 
                            labelCol={{ span: 6 }}  
                            wrapperCol={{ span: 18 }}
      
                          >
                            <TextArea 
                              rows={7} 
                              placeholder="Descrição" 
                              value={inputDescricao}
                              onChange={(e) => setInputDescricao(e.target.value)}
                              style={{
                                width: 416,
                                height: 172,
                                border: '1px solid #BDBDBD',
                                borderRadius: '4px',
                                resize: 'none',
                              }}
                            />  
                        </Form.Item>     
                        
                      </div>    
      
                    </div>
      
                    <div style={{ marginTop:"15px", marginBottom: "15px", display : 'flex', gap: '30px', alignItems: "flex-end", justifyContent: 'space-between'}}>
                        <div style={{ display:'flex', alignItems: "flex-end", justifyContent: 'space-between', width:'419px'}}>
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
                                        value={dayjs(selectedDate, "YYYY-MM-DD" )}
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

                                        <CustomButton onClick={openPopup} disabled={!isComputador} label="Softwares" className="blue size138" type="button"></CustomButton>

                                    {isPopupOpen && <PopUpTableSoftware idDispositivo={dispIdNumber} closePopup={closePopup} />}
                          
                        </div>
                      
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
                                    <Button type="submit" htmlType="submit" disabled={isButtonDisabled} label="Salvar" className="blue size138" > Salvar</Button>
                                  </Form.Item>                            
                                )}
                                
                                {showSuccess && (
                                <PopUpSucess
                                onClose={() => navigate(`/dispbylab/${inputIdsala}`)}
                                text= 'Dispositivo cadastrado'
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

export default DispEdit;