import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Input, Form, Button, notification } from 'antd';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import './styles.css';
import { redefinirSenha } from '../../services/api';

function NovaSenha() {
  const [inputPassword, setInputPassword] = useState('');
  const [inputConfirmPassword, setInputConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username;

  React.useEffect(() => {
    document.title = "Nova Senha - LECCS";
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
        message: 'Erro ao salvar senha',
        description: 'As senhas não coincidem!',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    }

    if (!username) {
      notification.error({
        message: 'Usuário não encontrado',
        description: 'Não foi possível identificar o usuário para redefinir a senha.',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    }

    setIsLoading(true);
    try {
      await redefinirSenha({ username, nova_senha: inputPassword });

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_info");
      localStorage.setItem("isAuthenticated", "false");

      notification.success({
        message: 'Senha alterada com sucesso!',
        description: 'Faça login novamente para continuar.',
        placement: 'bottomRight',
        duration: 4,
      });

      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error("Erro ao redefinir senha:", err);
      notification.error({
        message: 'Erro ao redefinir senha',
        description: 'Ocorreu um erro ao salvar sua nova senha. Tente novamente.',
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
          <h1 className="novasenha-heading">Nova Senha</h1>
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            onValuesChange={checkFields}
          >
            <div className='novasenha-input'>
              <Form.Item
                label="Senha"
                name="senha"
                rules={[{ required: true, message: 'Digite a sua Senha' }]}
                className="input-container"
              >
                <Input.Password
                  placeholder="Senha"
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
                rules={[{ required: true, message: 'Digite a Senha novamente' }]}
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
                >
                  Salvar
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </main>
  );
}

export default NovaSenha;
