import React, { useState, useEffect } from 'react';
import CustomInput from '../CustomInput/CustomInput.jsx';
import CustomButton from '../CustomButton/CustomButton.jsx';
import { Select, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { updateUsuario, fetchUsuarioPorId } from '../../services/api';
import './styles.css';

const UsuarioEditPopUp = ({ closePopup, usuarioId }) => {
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        perfil: { nivel_acesso: '' },
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    console.log(usuarioId)
    useEffect(() => {
        const carregarUsuario = async () => {
            if (!usuarioId) return;
            try {
                const usuario = await fetchUsuarioPorId(usuarioId);
                setFormData({
                    username: usuario.username || '',
                    first_name: usuario.first_name || '',
                    last_name: usuario.last_name || '',
                    email: usuario.email || '',
                    perfil: { nivel_acesso: usuario.nivel_acesso || '' },
                });
            } catch (err) {
                console.error('Erro ao carregar usuário:', err);
                message.error('Erro ao carregar usuário.');
            }
        };

        carregarUsuario();
    }, [usuarioId]);

    const handleChange = (field, value) => {
        if (field === 'nivel_acesso') {
            setFormData(prev => ({
                ...prev,
                perfil: { ...prev.perfil, nivel_acesso: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            await updateUsuario(usuarioId, formData);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            console.error('Erro ao atualizar usuário:', err);
            message.error('Erro ao atualizar usuário.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-user-container">
                <div className='title-container'>
                    <h2 className="popup-title-usuario">Editar Usuário</h2>
                </div>
                <button className="close-btn" onClick={closePopup}>X</button>

                <div className='popup-lab-input'>
                    <div className='usuario-input'>
                        <CustomInput
                            label="Nome de Usuário"
                            placeholder="Digite o Nome de Usuário"
                            className="input-field300"
                            value={formData.username}
                            onChange={e => handleChange('username', e.target.value)}
                        />
                    </div>
                    
                    <div className='usuario-input'>
                        <CustomInput
                            label="Primeiro Nome"
                            placeholder="Digite o Primeiro Nome"
                            className="input-field300"
                            value={formData.first_name}
                            onChange={e => handleChange('first_name', e.target.value)}
                        />
                    </div>
                    
                    <div className='usuario-input'>
                        <CustomInput
                            label="Último Nome"
                            placeholder="Digite o Último Nome"
                            className="input-field300"
                            value={formData.last_name}
                            onChange={e => handleChange('last_name', e.target.value)}
                        />
                    </div>
                    
                    <div className='usuario-input'>
                        <CustomInput
                            label="E-mail"
                            placeholder="Digite o E-mail"
                            className="input-field300"
                            value={formData.email}
                            onChange={e => handleChange('email', e.target.value)}
                        />
                    </div>

                    <div className="select-container-usuario">
                        <label htmlFor="nivelAcesso" className="input-label">Nível de Acesso</label>
                        <Select
                            id="nivelAcesso"
                            className='customSelect'
                            placeholder="Selecione o Nível de Acesso"
                            value={formData.perfil.nivel_acesso || undefined}
                            onChange={value => handleChange('nivel_acesso', value)}
                            style={{
                                border: '1px solid #BDBDBD',
                                borderRadius: '4px',
                                width: 300,
                                height: 50,
                                fontSize: 'clamp(14px, 2vw, 18px)',
                            }}
                            options={[
                                { label: 'Admin', value: 'admin' },
                                { label: 'Moderador', value: 'moderador' },
                                { label: 'Usuário', value: 'usuario' },
                            ]}
                        />
                    </div>
                </div>

                <div className="popup-lab-input" style={{ display: 'flex', justifyContent: 'center', gap: '50px' }}>
                    {isLoading ? (
                        <LoadingOutlined />
                    ) : (
                        <CustomButton
                            label="Salvar"
                            className="blue size138"
                            onClick={handleUpdate}
                        />
                    )}
                    {showSuccess && (
                        <div className="success-message">
                            Usuário atualizado com sucesso!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UsuarioEditPopUp;
