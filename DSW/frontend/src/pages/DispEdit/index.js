import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import {  Select, Input, DatePicker, 
        Form, Button, Radio } from 'antd';
import CustomButton from '../../components/CustomButton/CustomButton';
import PopUpSucess from '../../components/PopUpSucess/PopUpSucess';
import './styles.css';
import PopUpTableSoftware from '../../components/PopUpTableSoftware/PopUpTableSoftware';
import dayjs from "dayjs";
import { fetchSalas, fetchDispData, updateDispositivo } from '../../services/api';
import { LoadingOutlined } from '@ant-design/icons';

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

  const checkFields = () => {
    const status = form.getFieldValue("status");
    const modelo = form.getFieldValue("modelo");
    const tipo = form.getFieldValue("tipo");
    const patrimonio = form.getFieldValue("patrimonio");
    const data = form.getFieldValue("data");
    const sala = form.getFieldValue("sala");
    setIsButtonDisabled(!(status && sala && modelo && tipo && patrimonio && data));
  };

  useEffect(() => {
      const carregarDadosDoDispositivo = async () => {
        try {
          const dispositivo = await fetchDispData(dispIdNumber);
  
          form.setFieldsValue({
            sala: dispositivo.id_sala || null,
            tipo: dispositivo.tipo && dispositivo.tipo.toLowerCase() !== 'computador' ? 'outro' : dispositivo.tipo.toLowerCase() || '',
            status: dispositivo.status || null,
            dispositivo: dispositivo.tipo || '',
            configuracao: dispositivo.configuracao,
            descricao: dispositivo.descricao,
            modelo: dispositivo.modelo,
            patrimonio: dispositivo.patrimonio,
            data: dayjs(dispositivo.data_verificacao, "YYYY-MM-DD")
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
          setError(null);
        } catch (err) {
          setError('Erro ao carregar dados do dispositivo.');
        }
      };
      carregarDadosDoDispositivo();
    }, [dispIdNumber]);

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

  const handleSave = async () => {
    setIsLoading(true);
    setError(null); 

    const dataToUpdate = {
      id_sala: inputIdsala,
      tipo: inputTipo,
      modelo: inputModelo,
      patrimonio: inputPatrimonio,
      is_computador: isComputador,
      configuracao: inputConfiguracao,
      descricao: inputDescricao,
      status: selectedStatus,
      data_verificacao: selectedDate,
    };

    try {
      await updateDispositivo(dispIdNumber, dataToUpdate);
      setShowSuccess(true);
    } catch (err) {
      console.error("Erro ao salvar dados:", err);
      setError('Erro ao salvar dados. Por favor, tente novamente.');
    } finally {
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
        <>  
          <div className='headerAdd'>
            <h1 className='headerTitleAdd'>Editar Dispositivo</h1>
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
                dispositivo: inputTipo || '', }}
            > 
              <div className="wrap-group">
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
              <div className="wrap-group">
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
              <div className="wrap-group">
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
                      className='textInput'
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
                      className='textInput'
                    />  
                  </Form.Item>     
                </div>    
              </div>
              <div className="wrap-group-data">
                <div style={{ display:'flex', alignItems: "center", justifyContent: 'space-between', width:'419px'}}>
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
                      <LoadingOutlined />
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
        </>
  );
}

export default DispEdit;