import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Button, Result, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Content } = Layout;

const NotFound = () => {

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
            status="404"
            title="Ops!"
            subTitle="Desculpe, a página que você está procurando não existe."
            extra={<Button type="primary" onClick={() => navigate('/Laboratorio')}>Voltar para a página inicial</Button>}
            />

            </Content>
        
        </Layout>
    </Layout>
  )
};
export default NotFound;