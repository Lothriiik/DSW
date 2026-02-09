import React, { useState, useEffect } from 'react';
import "./style.css";
import { useNavigate } from 'react-router-dom';
import { Input, Form, Button, notification } from 'antd';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { login, fetchUsuarioInfo } from '../../services/api';

export default function LoginPage({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login - LECCS";
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/laboratorio');
    }
  }, []);

  const checkFields = () => {
    const usuario = form.getFieldValue("usuario");
    const senha = form.getFieldValue("senha");
    setIsButtonDisabled(!(usuario && senha));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { access, refresh } = await login(username, password);

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('isAuthenticated', 'true');

      const usuarioInfo = await fetchUsuarioInfo();
      localStorage.setItem("user_info", JSON.stringify(usuarioInfo));

      notification.success({
        message: 'Login realizado com sucesso!',
        description: 'Bem-vindo ao sistema!',
        placement: 'bottomRight',
        duration: 3,
      });

      setTimeout(() => navigate('/laboratorio'), 700);

    } catch (error) {
      console.error('Erro ao processar login:', error);

      if (error.response?.data?.detail === 'TROCA_SENHA_NECESSARIA') {
        notification.warning({
          message: 'Troca de senha necessária',
          description: 'Você precisa trocar sua senha antes de continuar.',
          placement: 'bottomRight',
          duration: 3,
        });

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user_info');

        setTimeout(() => navigate('/novasenha', { state: { username } }), 700);
        return;
      }

      notification.error({
        message: 'Falha no login',
        description: 'Usuário ou senha inválidos.',
        placement: 'bottomRight',
        duration: 3,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-container">
      <div className="login-left-panel">
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

      <div className="login-right-panel">
        <div className="login-form-container">
          <h1 className="login-heading">Login</h1>

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            onValuesChange={checkFields}
          >
            <div className="wrap-group-login">
              <Form.Item
                label="Usuário"
                name="usuario"
                rules={[{ required: true, message: "Digite o nome de usuário" }]}
                className="input-container"
              >
                <Input
                  placeholder="Usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field27050"
                />
              </Form.Item>

              <Form.Item
                label="Senha"
                name="senha"
                rules={[{ required: true, message: "Digite a sua senha" }]}
                className="login-input-container"
              >
                <Input.Password
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field27050"
                  visibilityToggle={{
                    visible: passwordVisible,
                    onVisibleChange: setPasswordVisible,
                  }}
                  iconRender={() => (passwordVisible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
              <div style={{ textAlign: 'right' }}>
                <Button type="link" onClick={() => navigate('/esqueci-senha')} style={{ padding: 0 }}>
                  Esqueci minha senha
                </Button>
              </div>
            </div>

            <div className="popup-actions-confirm">
              <Button
                type="submit"
                htmlType="submit"
                disabled={isButtonDisabled}
                className="blue size138"
                loading={isLoading}
              >
                Login
              </Button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <Button style={{ padding: 0 }} type="link" onClick={() => navigate('/registrar')}>
                Não possui conta? Cadastre-se
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </main>
  )
}
