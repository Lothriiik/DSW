import React, { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './styles.css';
import { Layout, Menu, Button } from "antd";

import Icon, {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  HddOutlined,
  DesktopOutlined,
  FileTextOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const exitSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 4H5V18C5 19.1046 5.89543 20 7 20H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 15L19 12M19 12L16 9M19 12H9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExitIcon = props => <Icon component={exitSvg} {...props} />;

function Header() {
  const user = JSON.parse(localStorage.getItem("user_info"));
  const isAdmin = user && user.nivel_acesso === 'admin';

  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([location.pathname]);
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    setSelectedKeys([e.key]);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate('/login');
  };

  return (
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
        <div
          className="icon"
          style={{
            opacity: collapsed ? 0 : 1,
            transition: "opacity 0.3s ease",
            visibility: collapsed ? "hidden" : "visible",
          }}
        >
          <div className="elipse">
            <UserOutlined style={{ fontSize: '35px' }} />
          </div>

          <span className="iconName" style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            Olá, {user.first_name}
          </span>
        </div>

        <Menu
          mode="vertical"
          selectedKeys={selectedKeys}
          onClick={handleMenuClick}
          style={{ borderRight: 0, height: '100vh' }}
          className="menuSider"
        >
          <Menu.Item key="/" icon={<HomeOutlined style={{ fontSize: '20px' }} />}>
            <Link to="/laboratorio">Início</Link>
          </Menu.Item>

          <hr className="linha" />

          <Menu.Item key="/laboratorio" icon={<HddOutlined style={{ fontSize: '20px' }} />}>
            <Link to="/laboratorio">Laboratórios</Link>
          </Menu.Item>

          <Menu.Item key="/dispositivos" icon={<DesktopOutlined style={{ fontSize: '20px' }} />}>
            <Link to="/dispositivos">Dispositivos</Link>
          </Menu.Item>

          <Menu.Item key="/observacao" icon={<FileTextOutlined style={{ fontSize: '20px' }} />}>
            <Link to="/observacao">Relatório</Link>
          </Menu.Item>

          {isAdmin && (
            <Menu.Item key="/usuarios" icon={<UserOutlined style={{ fontSize: '20px' }} />}>
              <Link to="/usuarios">Usuários</Link>
            </Menu.Item>
          )}

          <hr className="linha" />

          <Menu.Item key="/Sair" onClick={logout} icon={<ExitIcon style={{ fontSize: '20px' }} />}>
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
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>
    </>
  );
}

export default Header;
