import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Button, Result, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Content } = Layout;

const NotAuthorized = () => {

    const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
        <Layout>
        <Content
              style={{ 
                display:'flex',
                alignItems: 'center',
                justifyContent: 'center',}}
            >
            <Result
            status="403"
            title="Desculpe"
            subTitle="Você não tem permissão para acessar esta página."
            extra={<Button type="primary" onClick={() => navigate('/Laboratorio')}>Voltar para a página inicial</Button>}
            />

            </Content>
        
        </Layout>
    </Layout>
  )
};
export default NotAuthorized;