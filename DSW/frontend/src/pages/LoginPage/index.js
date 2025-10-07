import React, { useState, useEffect } from 'react';
import "./login.css";
import { useNavigate } from 'react-router-dom'; 
import {  Input, Form, Button, } from 'antd';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { login, fetchUserInfo } from '../../services/api';

export default function LoginPage({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleSubmit = async (event) => {

    try {
      const { access, refresh } = await login(username, password);
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('isAuthenticated', 'true');

      const userInfo = await fetchUserInfo();
      localStorage.setItem("user_info", JSON.stringify(userInfo));
      navigate('/laboratorio');

    } catch (error) {
      console.error('Erro ao processar login:', error);
    }
  };

  return (
    <main className="login-container">
      <div className="login-left-panel">
        <div className="overlay"></div>
        <div className="logo-container">
          <div className="logo-box">

          </div>
          <div className="brand-text">
            <h2 className="brand-subtitle">SISTEMAS</h2>
            <h1 className="brand-title">WHAN</h1>
          </div>
        </div>
        <div className="version-tag">
          <p>Versão Beta</p>
        </div>
      </div>

      <div className="login-right-panel">
        
        <div className="login-form-container">
          <div>
            <h1 className="login-heading">Login</h1>
          </div>
          <div>

          </div>
          <Form 
                form={form}
                onFinish={handleSubmit} 
                layout="vertical" 
                onValuesChange={checkFields}
                > 

          <div style={{marginBottom:'20px'}}>
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
                className="input-field24050"
              />
            </Form.Item>
          </div>
          <div style={{marginBottom:'20px'}}>
          <Form.Item  
              label="Senha" 
              name="senha" 
              rules={[{ required: true, message: "Digite a sua senha" }]}
              className="input-container"
            >
              <Input.Password
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field24050"
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
                iconRender={() => (passwordVisible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
          </div>
          <div style={{display:'flex', justifyContent:'center'}}>
            <Button type="submit" htmlType="submit" disabled={isButtonDisabled} label="Login"  className="blue size138" >Login</Button>
          </div>
        </Form>
        </div>
      </div>
    </main>
  )
}

