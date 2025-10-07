import React, { useState } from 'react';
import CustomInput from '../CustomInput/CustomInput.jsx';
import CustomButton from '../CustomButton/CustomButton.jsx';
import {  Select, Input, DatePicker, 
          Form, Button, Radio } from 'antd';
import './styles.css'; 
import { LoadingOutlined } from '@ant-design/icons';
import { createLaboratorio } from '../../services/api.jsx';

const UsuarioViewPopUp = ({ closePopup }) => {
    const [nome, setNome] = useState('');
    const [sala, setSala] = useState('');
    const [newLab, setNewLab] = useState({ nome: '', sala_ou_bloco: '' });
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false); 

    const isButtonDisabled = !(newLab.nome && newLab.sala_ou_bloco);

    const handleAddLab = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const createdLab = await createLaboratorio(newLab);
            setData(prevData => [...prevData, createdLab]);
            setNewLab({ nome: '', sala_ou_bloco: '' });
            setNome('');
            setSala('');
            
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 20000);
            
        } catch (err) {
            console.error("Erro ao adicionar laboratório:", err);
            setError("Erro ao adicionar laboratório: " + (err.response?.data?.detail || err.message));
        } finally {
            setTimeout(() => setIsLoading(false), 20000);
        }
    };

    return (
    <>
        {isOpen && (
            <div className="popup-overlay">
                <div className="popup-userview-container">
                    <h2 className="popup-title-usuario">Visualizar Usuário</h2>
                    <button className="close-btn" onClick={closePopup}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_2033_6804)">
                                <path d="M7 7L17 17M7 17L17 7" stroke="black" strokeOpacity="0.61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_2033_6804">
                                    <rect width="24" height="24" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                    
                    <div className='popup-lab-input'>
                        <div className='usuario-input'>
                            <CustomInput
                                label="Nome de Usuário"
                                placeholder="Digite o Nome de Usuário"
                                className="input-field300"
                                value={newLab.nome}
                                disabled={true}
                                onChange={(e) => setNewLab({ ...newLab, nome: e.target.value })}
                            />
                        </div>
                        
                        <div className='usuario-input'>
                            <CustomInput
                                label="E-mail"
                                placeholder="Digite o E-mail"
                                className="input-field300"
                                disabled={true}
                                value={newLab.nome}
                                onChange={(e) => setNewLab({ ...newLab, nome: e.target.value })}
                            />
                        </div>

                        <div className='usuario-input'>
                            <CustomInput
                                label="Primeiro Nome"
                                placeholder="Digite o Primeiro Nome"
                                className="input-field300"
                                disabled={true}
                                value={newLab.nome}
                                onChange={(e) => setNewLab({ ...newLab, nome: e.target.value })}
                            />
                        </div>

                        <div className='usuario-input'>
                            <CustomInput
                                label="Último Nome"
                                placeholder="Digite o Último Nome"
                                className="input-field300"
                                disabled={true}
                                value={newLab.nome}
                                onChange={(e) => setNewLab({ ...newLab, nome: e.target.value })}
                            />
                        </div>

                        
                    </div>
                </div>
            </div>
        )}
    </>
    );
};

export default UsuarioViewPopUp;
