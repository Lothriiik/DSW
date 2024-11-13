import React, { useState } from 'react';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import axios from 'axios'; 
import './LabCreatePopUp.css'; 

const LabCreatePopUp = () => {
    const [nome, setNome] = useState('');
    const [sala, setSala] = useState('');
    const [newLab, setNewLab] = useState({ nome: '', sala_ou_bloco: '' });
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false); 

    const closePopup = () => {
        setIsOpen(false);
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const isButtonDisabled = !(newLab.nome && newLab.sala_ou_bloco);

    const handleAddLab = async () => {
        setIsLoading(true); // Inicia o carregamento
        try {
            const csrfToken = getCookie('csrftoken');
            const response = await axios.post('http://127.0.0.1:8000/api/lab-create/', {
                nome: newLab.nome,
                sala_ou_bloco: newLab.sala_ou_bloco,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    'X-CSRFToken': csrfToken,
                }
            });

            setData(prevData => [...prevData, response.data]);
            setNewLab({ nome: '', sala_ou_bloco: '' });
            setNome('');
            setSala('');
            setShowSuccess(true);

            setTimeout(() => setShowSuccess(false), 20000);

        } catch (error) {
            setError("Erro ao adicionar software: " + (error.response?.data?.detail || error.message));
        } finally {
            setTimeout(() => 20000);
            setIsLoading(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div className="popup-container">
                    <h2 className="popup-title-lab">Adicionar Laboratório</h2>
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
                        <div>
                            <CustomInput
                                label="Nome"
                                placeholder="Digite o Nome do Laboratório"
                                className="input-field300"
                                value={newLab.nome}
                                onChange={(e) => setNewLab({ ...newLab, nome: e.target.value })}
                            />
                        </div>
                        <div className='input-sala'>
                            <CustomInput
                                label="Sala/Bloco"
                                placeholder="Digite a Sala e Bloco"
                                className="input-field300"
                                value={newLab.sala_ou_bloco}
                                onChange={(e) => setNewLab({ ...newLab, sala_ou_bloco: e.target.value })}
                            />
                        </div>
                        
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
                            <CustomButton
                                disabled={isButtonDisabled}
                                label="Adicionar"
                                className="blue size138"
                                onClick={handleAddLab}
                            />
                        )}
                        {showSuccess && (
                        <div className="success-message">
                            Laboratório adicionado com sucesso!
                        </div>
                        )}
                    </div>

                    
                </div>
            )}
        </>
    );
};

export default LabCreatePopUp;
