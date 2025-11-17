import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Input, Form, Button, message } from 'antd';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import PopUpSucess from '../../components/PopUpSucess/PopUpSucess';
import './styles.css';
import { registerUser } from '../../services/api';

function Registrar() {
  const [inputUsername, setInputUsername] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputConfirmPassword, setInputConfirmPassword] = useState('');
  const [inputFirstName, setInputFirstName] = useState('');
  const [inputLastName, setInputLastName] = useState('');
  const [error, setError] = useState(null); 
  const [showSuccess, setShowSuccess] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = React.useState(false);
  const [passwordError, setPasswordError] = useState('');
    
  const checkFields = () => {
    const usuario = form.getFieldValue("usuario");
    const nome = form.getFieldValue("nome");
    const sobrenome = form.getFieldValue("sobrenome");
    const email = form.getFieldValue("email");
    const senha = form.getFieldValue("senha");
    const confirmarsenha = form.getFieldValue("confirmarsenha");

    setIsButtonDisabled(!(usuario && nome && sobrenome && email && senha && confirmarsenha));

  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setInputPassword(value);
  
    if (inputConfirmPassword && inputConfirmPassword !== value) {
      setPasswordError('As senhas não coincidem!');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setInputConfirmPassword(value);
  
    if (inputPassword && value !== inputPassword) {
      setPasswordError('As senhas não coincidem!');
    } else {
      setPasswordError('');
    }
  };

  const handleSave = async () => {
    try {
      const userData = {
        username: inputUsername,
        email: inputEmail,
        password: inputPassword,
        first_name: inputFirstName,
        last_name: inputLastName,
      };

      await registerUser(userData);

      setShowSuccess(true);
      setError(null);
    } catch (err) {
      console.error("Erro ao salvar dados:", err);
      setError('Erro ao registrar usuário. Por favor, verifique os dados.');
    }
  };

  const handleSubmit = async () => {
    try {
      if (inputPassword !== inputConfirmPassword) {
        setPasswordError('As senhas não coincidem!');
        message.error('As senhas não coincidem!');
        return;
      }
      
      setIsLoading(true);
      await handleSave();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="registrar-container">
      <div className="registrar-left-panel">
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

      <div className="registrar-right-panel">
        <div className="registrar-form-container">
          <h1 className="registrar-heading">Registrar</h1>
          <Form 
            form={form}
            onFinish={handleSubmit} 
            layout="vertical" 
            onValuesChange={checkFields}
          > 
            <div className='registrar-input'>

              <div className="wrap-group-registrar">
              <Form.Item  
                label="Nome" 
                name="nome" 
                rules={[{ required: true, message: "Digite o seu Nome!" }]}
                className="input-container"

              >
                <Input
                  placeholder="Nome"
                  value={inputFirstName}
                  onChange={(e) => setInputFirstName(e.target.value)}
                  className="input-field27050"
                />
              </Form.Item>

              <Form.Item  
                label="Sobrenome" 
                name="sobrenome" 
                rules={[{ required: true, message: "Digite o seu Sobrenome" }]}
                className="input-container"

              >
                <Input
                  placeholder="Sobrenome"
                  value={inputLastName}
                  onChange={(e) => setInputLastName(e.target.value)}
                  className="input-field27050"
                />
              </Form.Item>
              </div>

        
              <div className="wrap-group-registrar">
              <Form.Item  
                label="Usuario" 
                name="usuario" 
                rules={[{ required: true, message: "Digite o seu Usuario" }]}
                className="input-container"

              >
                <Input
                  placeholder="Usuario"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  className="input-field27050"
                />
              </Form.Item>


              <Form.Item  
                label="Email" 
                name="email" 
                rules={[{ required: true, message: "Digite o seu Email" }]} 
                className="input-container"

              >
                <Input
                  placeholder="Email"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className="input-field27050"
                />
              </Form.Item>
              </div>

              <div className="wrap-group-registrar">
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
                    <Form.Item>
                      <div style={{paddingBottom:'40px'}}>
                        <Button type="submit" htmlType="submit" disabled={isButtonDisabled} label="Registrar"  className="blue size138" >Registrar</Button>
                      </div>
                      
                    </Form.Item>                            
                  )}
                  
                  {showSuccess && (
            
                  <PopUpSucess
                  onClose={() => navigate(`/login`)}
                  text= 'Usuario cadastrado'
                  />
                  )}
              </div>
            </div>
          </Form>
        </div>
      </div>
    </main>
  );
}

export default Registrar;
