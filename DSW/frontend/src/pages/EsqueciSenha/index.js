import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Input, Form, Button, notification } from 'antd';
import './styles.css';
import { requestPasswordReset } from '../../services/api';

function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "Esqueci Senha - LECCS";
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      await requestPasswordReset(values.email);

      notification.success({
        message: 'Email enviado!',
        description: 'Verifique sua caixa de entrada para redefinir a senha.',
        placement: 'bottomRight',
        duration: 4,
      });

      // Optional: navigate to login or stay here
      setTimeout(() => navigate('/login'), 3000);

    } catch (err) {
      console.error("Erro ao solicitar redefinição:", err);
      // API might return 400 if email not found, or 200 with message. 
      // The backend view returns 200 even if user not found (security practice) or specific message?
      // Checking backend views.py:
      // if user: send_mail ... return 200.
      // else: return 200 "Se o e-mail existir..."
      // So we always get 200 unless validation fails.

      const errorMessage = err.response?.data?.email
        ? err.response.data.email[0]
        : 'Ocorreu um erro ao processar sua solicitação.';

      notification.error({
        message: 'Erro',
        description: errorMessage,
        placement: 'bottomRight',
        duration: 4,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="esqueci-senha-container">
      <div className="esqueci-senha-left-panel">
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

      <div className="esqueci-senha-right-panel">
        <div className="esqueci-senha-form-container">
          <h1 className="esqueci-senha-heading">Esqueci a Senha</h1>
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
          >
            <div className='esqueci-senha-input'>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Digite o seu Email" },
                  { type: 'email', message: "Digite um email válido" }
                ]}
                className="esqueci-senha-input-container"
              >
                <Input
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field27050"
                  autoComplete="email"
                />
              </Form.Item>
              <div style={{ textAlign: 'right' }}>
                <Button style={{ padding: 0 }} type="link" onClick={() => navigate('/login')}>
                  Voltar para Login
                </Button>
              </div>
            </div>
            <div className="popup-actions-confirm">
              <Form.Item>
                <Button
                  type="submit"
                  htmlType="submit"
                  loading={isLoading}
                  className="blue size138"
                >
                  Enviar Link
                </Button>
              </Form.Item>

            </div>
          </Form>
        </div>
      </div>
    </main>
  );
}

export default EsqueciSenha;
