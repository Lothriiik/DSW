import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import "./login.css"


export default function LoginPage() {

  const [error, setError] = useState(null);

    const handleLoginSuccess = async (response) => {
        try {

            const googleToken = response.credential;


            const { data } = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
                token: googleToken
            });

            // Armazenar o token JWT no localStorage ou sessionStorage            localStorage.setItem('access_token', data.access_token);
        } catch (err) {
            setError('Erro ao autenticar com o Google.');
        }
    };

    const handleLoginFailure = (error) => {
      setError('Erro ao fazer login com o Google.');
  };


  return (
    <main className="login-container">
      {/* Left side - Blue background with logo */}
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
          <h1 className="login-heading">Login</h1>

          {error && <p style={{ color: 'red' }}>{error}</p>}
            <GoogleLogin 
                onSuccess={handleLoginSuccess} 
                onError={handleLoginFailure} 
            />
        </div>
      </div>
    </main>
  )
}

