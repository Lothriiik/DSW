import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import {
  Select, Input, DatePicker,
  Form, Button, Radio
} from 'antd';
import axios from 'axios';
import PopUpSucess from '../../components/PopUpSucess/PopUpSucess';
import './styles.css';
import { LoadingOutlined } from '@ant-design/icons';
import { fetchSalas, createDispositivo } from '../../services/api';

function DispAdd() {
  const [inputTipo, setInputTipo] = useState('Computador');
  const [inputModelo, setInputModelo] = useState('');
  const [inputIdsala, setInputIdsala] = useState('');
  const [inputPatrimonio, setInputPatrimonio] = useState('');
  const [inputConfiguracao, setInputConfiguracao] = useState('');
  const [inputDescricao, setInputDescricao] = useState('');
  const [isComputador, setIsComputador] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [value, setValue] = React.useState('computador');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [salaDisabled, setsalaDisabled] = useState(false);
  const [salas, setSalas] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { deviceId } = location.state || {};
  const deviceIdNumber = parseInt(deviceId, 10)
  const [form] = Form.useForm();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { TextArea } = Input;

  useEffect(() => {

    if (!isNaN(deviceIdNumber) && deviceIdNumber !== null) {
      setInputIdsala(deviceIdNumber)
      setsalaDisabled(true);
    }

  }, []);

  const handleDateChange = (value) => {
    const formattedDate = value.format('YYYY-MM-DD');
    setSelectedDate(formattedDate);
  };

  const checkFields = () => {
    const status = form.getFieldValue("status");
    const modelo = form.getFieldValue("modelo");
    const tipo = form.getFieldValue("tipo");
    const patrimonio = form.getFieldValue("patrimonio");
    const data = form.getFieldValue("data");
    const sala = form.getFieldValue("sala");

    setIsButtonDisabled(!(status && sala && modelo && tipo && patrimonio && data));
  };

  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    setValue(selectedValue);
    setIsComputador(selectedValue === 'computador');
    if (selectedValue === 'outro') {
      setInputTipo('');
    }
    if (!value) {
      setValue('');
    };
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value)
  };

  const handleSalaChange = (value) => {
    setInputIdsala(value);
  };

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
    setError(null);
    setShowSuccess(false);

    const dataToCreate = {
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
      await createDispositivo(dataToCreate);
      setShowSuccess(true);
    } catch (err) {
      console.error("Erro ao salvar dados:", err);
      setError('Erro ao salvar os dados.');
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await handleSave();
      setShowSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='headerAdd'>
        <h1 className='headerTitleAdd'>Adicionar Dispositivos</h1>
      </div>
      <div className='addDiv'>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          onValuesChange={checkFields}
          initialValues={{
            sala: deviceIdNumber || null,
            tipo: value,
            dispositivo: inputTipo,
            status: selectedStatus || null,
          }}
        >

          <div className="wrap-group">
            <div className='tipoContainer'>
              <div className='radioContainer'>

                <Form.Item label="Tipo" name="tipo" >
                  <Radio.Group
                    size='large'
                    buttonStyle="solid"
                    onChange={handleRadioChange}
                    style={{ display: "flex", gap: "20px" }}
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
                  disabled={salaDisabled}
                />
              </Form.Item>

            </div>

            <Form.Item
              label="Modelo"
              name="modelo"
              rules={[{ required: true, message: "Digite o Modelo" }]}
              labelCol={{ span: 10 }}
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

            <div className="popup-actions-confirm">
              {isLoading ? (
                <LoadingOutlined />
              ) : (
                <Form.Item>
                  <Button type="submit" htmlType="submit" disabled={isButtonDisabled} label="Adicionar" className="blue size138" > Adicionar</Button>
                </Form.Item>
              )}

              {showSuccess && (
                <PopUpSucess
                  onClose={() => navigate(`/dispbylab/${inputIdsala}`)}
                  text='Dispositivo cadastrado'
                />
              )}
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}

export default DispAdd;
