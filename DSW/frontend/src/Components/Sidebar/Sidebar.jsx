import React, { useState, useContext  } from "react";
import { useNavigate } from 'react-router-dom'; 
import './styles.css';
import { Layout, Menu, Button,} from "antd";
import { Link, useLocation  } from 'react-router-dom';

import Icon, {
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
    HddOutlined,
    DesktopOutlined,
    FileTextOutlined

  } from '@ant-design/icons';

const { Sider } = Layout;


const exitSvg = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 4H5V18C5 19.1046 5.89543 20 7 20H15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16 15L19 12M19 12L16 9M19 12H9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );


const ExitIcon = props => <Icon component={exitSvg} {...props} />;

function Header() {
    const user = JSON.parse(localStorage.getItem("user_info"));
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const [selectedKeys, setSelectedKeys] = useState([location.pathname]);
    const navigate = useNavigate();

  const handleMenuClick = (e) => {
    setSelectedKeys([e.key]);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    navigate('/login');
  };
  

    return(
        <>
      <Sider 
        width={233} 
        className="sidebar" 
        theme="dark"
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="md"
        collapsedWidth="0"
        trigger={null}
        >
            <div className='icon' style={{ 
                opacity: collapsed ? 0 : 1,
                transition: "opacity 0.3s ease", 
                visibility: collapsed ? "hidden" : "visible",
             }}>
                <div className='elipse'>
                    <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_2079_4634)">
                        <path d="M18.5 18.5C20.2522 18.5 21.9651 17.9804 23.422 17.0069C24.8789 16.0335 26.0145 14.6498 26.685 13.031C27.3555 11.4121 27.531 9.6308 27.1891 7.91225C26.8473 6.1937 26.0035 4.61511 24.7645 3.37611C23.5255 2.1371 21.9469 1.29333 20.2284 0.951484C18.5098 0.609643 16.7285 0.785089 15.1097 1.45563C13.4908 2.12618 12.1072 3.26171 11.1337 4.71862C10.1602 6.17554 9.64063 7.88841 9.64062 9.64063C9.64297 11.9896 10.5771 14.2416 12.2381 15.9026C13.899 17.5635 16.1511 18.4977 18.5 18.5ZM18.5 3.73438C19.6681 3.73438 20.8101 4.08077 21.7813 4.72976C22.7526 5.37875 23.5096 6.30118 23.9567 7.38041C24.4037 8.45963 24.5207 9.64718 24.2928 10.7929C24.0649 11.9386 23.5024 12.991 22.6764 13.817C21.8503 14.643 20.798 15.2055 19.6523 15.4334C18.5066 15.6613 17.319 15.5443 16.2398 15.0973C15.1605 14.6503 14.2381 13.8932 13.5891 12.922C12.9401 11.9507 12.5938 10.8088 12.5938 9.64063C12.5938 8.07419 13.216 6.57192 14.3237 5.46428C15.4313 4.35664 16.9336 3.73438 18.5 3.73438Z" fill="#333333"/>
                        <path d="M18.5 21.4541C14.9767 21.458 11.5989 22.8594 9.10753 25.3507C6.61619 27.842 5.21485 31.2199 5.21094 34.7432C5.21094 35.1348 5.3665 35.5103 5.64341 35.7873C5.92032 36.0642 6.29589 36.2197 6.6875 36.2197C7.07911 36.2197 7.45468 36.0642 7.73159 35.7873C8.0085 35.5103 8.16406 35.1348 8.16406 34.7432C8.16406 32.0019 9.25302 29.3729 11.1914 27.4346C13.1298 25.4962 15.7587 24.4072 18.5 24.4072C21.2413 24.4072 23.8702 25.4962 25.8086 27.4346C27.747 29.3729 28.8359 32.0019 28.8359 34.7432C28.8359 35.1348 28.9915 35.5103 29.2684 35.7873C29.5453 36.0642 29.9209 36.2197 30.3125 36.2197C30.7041 36.2197 31.0797 36.0642 31.3566 35.7873C31.6335 35.5103 31.7891 35.1348 31.7891 34.7432C31.7852 31.2199 30.3838 27.842 27.8925 25.3507C25.4011 22.8594 22.0233 21.458 18.5 21.4541Z" fill="#333333"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_2079_4634">
                        <rect width="35.4375" height="35.4375" fill="white" transform="translate(0.78125 0.78125)"/>
                        </clipPath>
                        </defs>
                    </svg>
                </div>
                <span className='iconName' style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',}}
                    >Olá, {user.first_name}</span>
            </div>

                    <Menu
                        mode="vertical"
                        selectedKeys={selectedKeys}
                        onClick={handleMenuClick}
                        style={{borderRight: 0, height: '100vh',}}
                        className="menuSider"
                    >
                        <Menu.Item key="/" style={{ display: 'flex', alignItems: 'center', justifyContent:'initial'  }} icon={
                            <HomeOutlined style={{ fontSize: '20px'}} />}>
                            <Link to="/">Inicio</Link>
                        </Menu.Item>
                        <Menu.Item key="/Configurações" style={{ display: 'flex', alignItems: 'center', justifyContent:'initial'  }} icon={
                            <SettingOutlined style={{ fontSize: '20px'}}/>}>
                            <Link to="#">Configurações</Link>
                        </Menu.Item>
                        <hr className='linha'></hr>
                        <Menu.Item key="/laboratorio" style={{display: 'flex', alignItems: 'center', justifyContent:'initial'  }} icon={
                            <HddOutlined style={{ fontSize: '20px'}} />}>
                            <Link to="/laboratorio">Laboratorios</Link>
                        </Menu.Item>
                        <Menu.Item key="/dispositivos" style={{ display: 'flex', alignItems: 'center', justifyContent:'initial'  }} icon={
                            <DesktopOutlined style={{ fontSize: '20px'}}/>}>
                            <Link to="/dispositivos">Dispositivos</Link>
                        </Menu.Item>
                        <Menu.Item key="/observacao" style={{ display: 'flex', alignItems: 'center', justifyContent:'initial'  }} icon={
                            <FileTextOutlined style={{ fontSize: '20px'}}/>}>
                            <Link to="/observacao">Relatorio</Link>
                        </Menu.Item>
                        <hr className='linha'></hr>

                        <Menu.Item key="/Sair" onClick={logout} icon={
                            <ExitIcon style={{ fontSize: '20px' }} />}>
                            <Link to="">Sair</Link>
                        </Menu.Item>
                        
                    </Menu>
                    
                </Sider>
                    <div className="sider-trigger">
                    <Button
                    type="primary"
                    className="buttonSider"
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        left: collapsed ? 0 : 220,
                    }}
                    >
                        {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined />}

                    </Button>
                </div>

                </>
    );
}
export default Header;