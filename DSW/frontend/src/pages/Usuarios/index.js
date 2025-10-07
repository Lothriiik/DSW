import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import PopUpDelete from '../../components/PopUpDelete/PopUpDelete';
import UsuarioEditPopUp from '../../components/UsuarioEditPopUp/UsuarioEditPopUp'
import UsuarioViewPopUp from '../../components/UsuarioViewPopUp/UsuarioViewPopUp'
import { Button, Input, Space, Table } from "antd";
import { SearchOutlined, EditOutlined, EyeOutlined, DeleteOutlined, KeyOutlined  } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { fetchUsuarios, deleteUsuario } from '../../services/api';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioIdEdit, setUsuarioIdEdit] = useState('');
  const [usuarioIdView, setUsuarioIdView] = useState('');
  const [showDeletePopUp, setShowDeletePopUp] = useState(false); 
  const [usuarioToDelete, setUsuarioToDelete] = useState(null); 
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const generateEmptyRows = (totalRows, currentRows) => {
    const emptyRowsCount = totalRows - currentRows.length;
    const emptyRows = Array(emptyRowsCount).fill({});
    return [...currentRows, ...emptyRows];
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const openEditPopup = (id) => {
    setUsuarioIdEdit(id);
    setIsEditOpen(true);
  };

  const closeEditPopup = () => {
    setIsEditOpen(false);
  };

  const openViewPopup = (id) => {
    setUsuarioIdView(id);
    setIsViewOpen(true);
  };
  const closeViewPopup = (id) => {
    setIsViewOpen(true);
  };

  const rows = generateEmptyRows(7, usuarios);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined style={{ color:"#fff"}} />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => {
            var _a;
            return (_a = searchInput.current) === null || _a === void 0 ? void 0 : _a.select();
          }, 100);
        }
      },
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const columns = [
    Object.assign(
      { title: 'Nome', dataIndex: 'first_name', key: 'first_name', width: '25%', onHeaderCell: () => {
        return {
          style: {
            backgroundColor: '#0095DA',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center'
          }
        };
      },
    }, 
      getColumnSearchProps('first_name'),
    ),
    Object.assign(
      { title: 'Email', dataIndex: 'email', key: 'email', width: '30%', onHeaderCell: () => {
        return {
          style: {
            backgroundColor: '#0095DA',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center'
          }
        };
      },
    },
      getColumnSearchProps('email'),
    ),
    Object.assign(
      { title: 'Cargo', dataIndex: 'nivel_acesso', key: 'nivel_acesso', width: '30%' ,onHeaderCell: () => {
        return {
          style: {
            backgroundColor: '#0095DA',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center'
          }
        };
      },
    },
      getColumnSearchProps('nivel_acesso'),
    ),
    Object.assign(
      { title: '', dataIndex: '', key: '', width: '15%' , onHeaderCell: () => {
        return {
          style: {
            backgroundColor: '#0095DA',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center'
          }
        };
      },
      render: (_, record) => {
        if (!record || !Object.values(record).some(value => value && value !== '')) {
          return null;
        }
        return (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <Button onClick={openEditPopup}   label="Redefinir Senha" style={{ backgroundColor: 'transparent', border: 'none', padding: '5px', cursor: 'pointer' }}> 
              <KeyOutlined style={{ fontSize: '20px', color: '#525252ff' }} />
            </Button>
            <Button onClick={() => openEditPopup(record.id)}   label="Editar" style={{ backgroundColor: 'transparent', border: 'none', padding: '5px', cursor: 'pointer' }}> 
              <EditOutlined style={{ fontSize: '20px', color: '#2ECC40' }} />
            </Button>
            <Button onClick={openViewPopup}  label="Visualizar"style={{ backgroundColor: 'transparent', border: 'none', padding: '5px', cursor: 'pointer' }} >
              <EyeOutlined style={{ fontSize: '20px', color: '#0095DA' }} />
            </Button>
            <Button onClick={() => handleDelete(record.id)}  label="Deletar" style={{ backgroundColor: 'transparent', border: 'none', padding: '5px', cursor: 'pointer' }}>
              <DeleteOutlined style={{ fontSize: '20px', color: '#ED1C24' }} />
            </Button>
          </div>
        )
    },
    },
    ),
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await fetchUsuarios();
        setUsuarios(usersData || []);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar usuários:', err);
        setError('Erro ao carregar usuários.');
      }
    };

    fetchData();
  }, []);

  const handleDelete = (id) => {
    setUsuarioToDelete(id);
    setShowDeletePopUp(true);
  };

  const confirmDelete = async () => {
    try {

        await deleteUsuario(usuarioToDelete);
        setUsuarios(prevData => prevData.filter(user => user.id !== usuarioToDelete));
        setShowDeletePopUp(false);
        setError(null);
        
    } catch (err) {
        setError("Erro ao excluir usuário: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <>
      <div className="header">
        <h1 className="headerTitle">Usuarios</h1>

      </div>
      <div className="formContainer">
        <div className="containerUsuarioCard">
          <Table className="tabelausuario" Table columns={columns} dataSource={rows} onRow={(record) => {
              return {
                style: record.empty
                  ? { height: '60px' }
                  : { height: '60px' },
              };
            }}/>
        </div>
        {showDeletePopUp && (
            <PopUpDelete
                onConfirm={confirmDelete}
                onClose={() => setShowDeletePopUp(false)}
                text={'laboratorio'}
            />
        )}
        {isEditOpen && 
          <UsuarioEditPopUp 
            usuarioId={usuarioIdEdit} 
            closePopup={closeEditPopup} 
          />}
        {isViewOpen && 
          <UsuarioViewPopUp 
            usuarioId={usuarioIdView} 
            closePopup={closeViewPopup} 
          />}
      </div>
    </>
  );
}

export default Usuarios;
