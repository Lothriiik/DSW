import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { ConfigProvider, Select, Input, DatePicker } from 'antd';
import axios from 'axios';
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomInput from '../../components/CustomInput/CustomInput';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { styled } from "@mui/system";
import PopUpTableSoftware from '../../components/PopUpTableSoftware/PopUpTableSoftware';
import dayjs from 'dayjs';
import './styles.css';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
};

function LabDispView() {
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

  const [salas, setSalas] = useState([]); 
  const navigate = useNavigate();
  const location = useLocation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { dispId } = location.state || {};
  const dispIdNumber = parseInt(dispId, 10);
  const { TextArea } = Input;

  useEffect(() => {
    const fetchDispData = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/laboratorios/disp-by-id/?id_dispositivo=${dispIdNumber}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
            const dispositivo = response.data.Dispositivos[0];
            setInputConfiguracao(dispositivo.configuracao);
            setInputDescricao(dispositivo.descricao);
            setInputIdsala(dispositivo.id_sala);
            setInputModelo(dispositivo.modelo);
            setInputPatrimonio(dispositivo.patrimonio);
            setInputTipo(dispositivo.tipo);
            setIsComputador(dispositivo.is_computador);
            setSelectedDate(dispositivo.data_verificacao);
            setSelectedStatus(dispositivo.status);
       
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

  const handleDateChange = (value) => {
    if (value) {
      const formattedDate = value.format('YYYY-MM-DD');
      setSelectedDate(formattedDate);
    } else {
      setSelectedDate(null);
    }
  };

  const CustomRadio = styled(Radio)(({ theme }) => ({
    "& .MuiSvgIcon-root": {
      fontSize: '28px',
    },
    "&.Mui-checked": {
      color: "#0095DA",
    },
    "& .MuiTouchRipple-root": {
      border: "2px solid #0095DA",
      borderRadius: "50%", 
    },
    "&:hover": {
      backgroundColor: "rgba(0, 149, 218, 0.1)",
    },
  }));

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
  
  return (
    <main className='LaboratoriesLabAdd'>
      <section className='principalLabAdd'>
        <Sidebar />
        <div className='mainContentLabAdd'>
          <div className='headerLabAdd'>
            <h1 className='headerTitleLabAdd'>Editar Dispositivo</h1>
          </div>
          <div className='addDiv'>

            <div style={{ marginTop:"15px" ,marginBottom: "15px" ,display : 'flex' , gap: '35px' , alignItems: "center" , justifyContent: 'space-between'}}>
              <div className='tipoContainer'>
                <div className='radioContainer'>
                  
                  <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Tipo</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-radio-buttons-group-label"
                      name="radio-buttons-group"
                      value={radioTipo}
                      onChange={handleRadioChange}
                      sx={{
                        '& .MuiSvgIcon-root': {
                            fontSize: 28,
                          },
                        gap: '15px',
                      }}
                    >
                      <FormControlLabel value="computador" control={<Radio />} label="Computador" style={{pointerEvents: 'none'}} />
                      <FormControlLabel value="outro" control={<Radio />} label="Outro"  style={{pointerEvents: 'none'}} />
                    </RadioGroup>
                  </FormControl>
                </div>
                
              </div>

              <CustomInput
                label="Dispositivo"
                placeholder="Tipo"
                value={inputTipo}
                onChange={(e) => setInputTipo(e.target.value)}
                className="active input-field27050"
                defaultValue={inputTipo}
                isUntouchable={true}    

              />

              <CustomInput
                label="Patrimonio"
                placeholder="Patrimônio"
                value={inputPatrimonio}
                onChange={(e) => setInputPatrimonio(e.target.value)}
                className="input-field27050"
                defaultValue={inputPatrimonio}
                isUntouchable={true}  
              />

            </div>

            <div style={{ marginTop:"15px" ,marginBottom: "15px" ,display : 'flex' , gap: '35px' , alignItems: "center" , justifyContent: 'space-between'}}>
              <div className="select-container">
                <label htmlFor="statusSelect" className="select-label">
                  Status
                </label>
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
                      pointerEvents: 'none'

                    }}
                    onChange={handleStatusChange}
                    value={selectedStatus || null}
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
              </div>
              <div className="select-container">
                <label htmlFor="statusSelect" className="select-label">
                  Sala
                </label>
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
                    value={inputIdsala || null}
                    onChange={handleSalaChange}
                    options={salas}
                />
              </div>
              <CustomInput
                isUntouchable={true}  
                defaultValue={inputModelo}
                label="Marca/Modelo"
                placeholder="Modelo"
                value={inputModelo}
                onChange={(e) => setInputModelo(e.target.value)}
                className="input-field27050"
              />
            </div>
            
            <div style={{ marginTop:"15px" ,marginBottom: "15px" ,display : 'flex' , gap: '30px' , alignItems: "center" , justifyContent: 'space-between'}}>
              <div className="select-container">
              <label htmlFor="statusSelect" className="select-label">
                  Configurações
                </label>
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
                    pointerEvents: 'none'
                  }}
                /> 
              </div>        
              
              <div className="select-container">
                <label htmlFor="statusSelect" className="select-label">
                  Descrição
                </label>    
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
                    pointerEvents: 'none'
                  }}
                />  
              </div>    

            </div>

            <div style={{ marginTop:"15px", marginBottom: "15px", display : 'flex', gap: '30px', alignItems: "flex-end", justifyContent: 'space-between'}}>
              <div style={{ display:'flex', alignItems: "flex-end", justifyContent: 'space-between', width:'419px'}}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "250px" }}>
                  <label
                          htmlFor="custom-date-picker"
                          style={{
                            fontSize: 'clamp(10px, 2vw, 14px)',
                            color: '#4F4F4F',
                            fontWeight: 'bold',
                            display: 'block',
                          }}
                        >
                          Data
                  </label>
                  <DatePicker 
                    onChange={handleDateChange} 
                    value={dayjs(selectedDate, "YYYY-MM-DD" )}
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
                </div>
                <CustomButton onClick={openPopup} disabled={!isComputador} label="Softwares" className="blue size138"></CustomButton>
                {isPopupOpen && <PopUpTableSoftware idDispositivo={dispIdNumber} closePopup={closePopup} />}
              </div>
                
              
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LabDispView;
