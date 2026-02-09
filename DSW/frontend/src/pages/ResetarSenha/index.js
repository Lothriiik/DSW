import React, { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Input, Form, Button, notification } from 'antd';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import './styles.css';
import { confirmPasswordReset } from '../../services/api';

function ResetarSenha() {
    const [inputPassword, setInputPassword] = useState('');
    const [inputConfirmPassword, setInputConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [form] = Form.useForm();

    const navigate = useNavigate();
    const { uid, token } = useParams();

    React.useEffect(() => {
        document.title = "Redefinir Senha - LECCS";
    }, []);

    const checkFields = () => {
        const senha = form.getFieldValue("senha");
        const confirmarsenha = form.getFieldValue("confirmarsenha");
        setIsButtonDisabled(!(senha && confirmarsenha));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setInputPassword(value);
        setPasswordError(inputConfirmPassword && inputConfirmPassword !== value ? 'As senhas não coincidem!' : '');
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setInputConfirmPassword(value);
        setPasswordError(inputPassword && value !== inputPassword ? 'As senhas não coincidem!' : '');
    };

    const handleSubmit = async () => {
        if (inputPassword !== inputConfirmPassword) {
            setPasswordError('As senhas não coincidem!');
            notification.error({
                message: 'Erro',
                description: 'As senhas não coincidem!',
                placement: 'bottomRight',
                duration: 3,
            });
            return;
        }

        if (!uid || !token) {
            notification.error({
                message: 'Erro',
                description: 'Link inválido ou expirado.',
                placement: 'bottomRight',
            });
            return;
        }

        setIsLoading(true);
        try {
            await confirmPasswordReset({ uidb64: uid, token, new_password: inputPassword });

            notification.success({
                message: 'Senha redefinida com sucesso!',
                description: 'Você já pode fazer login com a nova senha.',
                placement: 'bottomRight',
                duration: 4,
            });

            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error("Erro ao redefinir senha:", err);
            const errorMsg = err.response?.data?.erro || 'Ocorreu um erro ao salvar sua nova senha. Tente novamente.';
            notification.error({
                message: 'Erro ao redefinir senha',
                description: errorMsg,
                placement: 'bottomRight',
                duration: 4,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="novasenha-container">
            <div className="novasenha-left-panel">
                <div className="logo-container">
                    <div className="brand-text">
                        <h2 className="brand-subtitle">SISTEMAS</h2>
                        <h1 className="brand-title">LECC</h1>
                    </div>
                </div>
                <div className="version-tag">
                    <p>Versão Beta</p>
                </div>
            </div>

            <div className="novasenha-right-panel">
                <div className="novasenha-form-container">
                    <h1 className="novasenha-heading">Redefinir Senha</h1>
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                        onValuesChange={checkFields}
                    >
                        <div className='novasenha-input'>
                            <Form.Item
                                label="Nova Senha"
                                name="senha"
                                rules={[{ required: true, message: 'Digite a sua nova senha' }]}
                                className="input-container"
                            >
                                <Input.Password
                                    placeholder="Nova Senha"
                                    value={inputPassword}
                                    onChange={handlePasswordChange}
                                    className="input-field27050"
                                    visibilityToggle={{
                                        visible: passwordVisible,
                                        onVisibleChange: setPasswordVisible,
                                    }}
                                    iconRender={() => (passwordVisible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Confirmar Senha"
                                name="confirmarsenha"
                                rules={[{ required: true, message: 'Confirme a nova senha' }]}
                                validateStatus={passwordError ? 'error' : ''}
                                help={passwordError || ''}
                                className="input-container"
                            >
                                <Input.Password
                                    placeholder="Confirmar Senha"
                                    value={inputConfirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    className="input-field27050"
                                    visibilityToggle={{
                                        visible: confirmPasswordVisible,
                                        onVisibleChange: setConfirmPasswordVisible,
                                    }}
                                    iconRender={() => (confirmPasswordVisible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>
                        </div>

                        <div className="popup-actions-confirm">
                            <Form.Item>
                                <Button
                                    type="submit"
                                    htmlType="submit"
                                    disabled={isButtonDisabled}
                                    loading={isLoading}
                                    className="blue size138"
                                    block
                                >
                                    Salvar Nova Senha
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </div>
        </main>
    );
}

export default ResetarSenha;
