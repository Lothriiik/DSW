import { Button, Result} from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {

    const navigate = useNavigate();

  return (
    <>
      <Result
      status="404"
      title="Ops!"
      subTitle="Desculpe, a página que você está procurando não existe."
      extra={<Button type="primary" onClick={() => navigate('/Laboratorio')}>Voltar para a página inicial</Button>}
      />
    </>
  )
};
export default NotFound;