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
import PopUpSucess from '../../components/PopUpSucess/PopUpSucess';
import dayjs from 'dayjs';
import './styles.css';


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
  const location = useLocation();
  const { obsId } = location.state || {};
  const obsIdNumber = parseInt(obsId, 10)

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
    const fetchObsData = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/problemas/obs-by-id/?id_observacao=${obsIdNumber}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
            console.log(response);
            const observacao = response.data.observacao[0];
            
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
    <main className='LaboratoriesLabAdd'>
      <section className='principalLabAdd'>
        <Sidebar />
        <div className='mainContentLabAdd'>
          <div className='headerLabAdd'>
            <h1 className='headerTitleLabAdd'>Editar Observação</h1>
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
                      value={tipo}
                      onChange={handleRadioChange}
                      disabled={true}
                      sx={{
                        '& .MuiSvgIcon-root': {
                            fontSize: 28,
                          },
                        gap: '15px',
                      }}
                    >
                      <FormControlLabel value="Dispositivo" control={<Radio />} label="Dispositivo" style={{pointerEvents: 'none'}} />
                      <FormControlLabel value="Laboratorio" control={<Radio />} label="Laboratorio" style={{pointerEvents: 'none'}} />
                    </RadioGroup>
                  </FormControl>
                </div>                
              </div>
            </div>

            <div style={{ marginTop:"15px", marginBottom: "15px", display : 'flex', gap: '30px', alignItems: "center", justifyContent: 'space-between'}}>
                
                
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
                      pointerEvents: 'none',

                    }}
                    onChange={handleSalaChange}
                    options={salas}
                    value={idSala}
                />
              </div>

              <div className="select-container">
                  <label htmlFor="statusSelect" className="select-label">
                    Dispositivo
                  </label>
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
                        pointerEvents: 'none',

                      }}
                      onChange={handleDispositivoChange}
                      options={dispositivos}
                      value={idDisp}
                  />
                </div>

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
                    format="YYYY-MM-DD" 
                    placeholder="Escolha a data"
                    value={data ? dayjs(data) : null} 
                    style={{
                      width: "200PX",
                      height: "50px",
                      borderRadius: "4px",
                      border: "1px solid #BDBDBD",
                      fontSize: "clamp(14px, 2vw, 16px)",
                      pointerEvents: 'none',
                    }}
                    
                  />
                </div>

                
                
              
            </div>

            <div style={{ marginTop:"15px", marginBottom: "15px", display : 'flex', gap: '30px', alignItems: "center", justifyContent: 'space-between'}}>

              <div className="select-container">
                  <label htmlFor="statusSelect" className="select-label">
                      Observação
                    </label>
                    <TextArea 
                      rows={7} 
                      placeholder="Configurações" 
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value)}
                      style={{
                        width: 416,
                        height: 172,
                        resize: 'none',
                        pointerEvents: 'none',
                      }}
                    /> 
                </div>  
            </div>         
          </div>
        </div>
      </section>
    </main>
  );
}

export default ObservacaoView;
