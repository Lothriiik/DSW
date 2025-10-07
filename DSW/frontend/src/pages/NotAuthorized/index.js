import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';


const NotAuthorized = () => {

    const navigate = useNavigate();

  return (
    <>
      <Result
      status="403"
      title="Desculpe"
      subTitle="Você não tem permissão para acessar esta página."
      extra={<Button type="primary" onClick={() => navigate('/Laboratorio')}>Voltar para a página inicial</Button>}
      />
    </>
  )
};
export default NotAuthorized;