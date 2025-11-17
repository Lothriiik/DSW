import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

///Laboratorios

export const fetchSalas = async () => {
  try {
    const response = await api.get('laboratorios/lab-list/');
    const data = response.data.Laboratorio;
    const formattedSalas = data.map((sala) => ({
      value: sala.id_sala,
      label: `${sala.nome} - ${sala.sala_ou_bloco}`,
    }));
    return formattedSalas;
  } catch (error) {
    console.error('Erro ao buscar as salas:', error);
    throw error; 
  }
};

export const createLaboratorio = async (labData) => {
  try {
    const response = await api.post('laboratorios/lab-create/', labData);
    return response.data; 
  } catch (error) {
    console.error('Erro ao criar laboratório:', error);
    throw error; 
  }
};

export const fetchLaboratorioById = async (idSala) => {
  try {
    const response = await api.get(`laboratorios/lab-by-id/?id_sala=${idSala}`);
    return response.data.laboratorio[0];
  } catch (error) {
    console.error(`Erro ao buscar laboratório com ID ${idSala}:`, error);
    throw error;
  }
};

export const fetchLaboratorios = async () => {
  try {
    const response = await api.get('laboratorios/lab-list/');
    return response.data.Laboratorio;
  } catch (error) {
    console.error('Erro ao buscar laboratórios:', error);
    throw error;
  }
};

export const deleteLaboratorio = async (laboratorioId) => {
  try {
    const response = await api.delete(`laboratorios/lab-delete/?id_sala=${laboratorioId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar o laboratório ${laboratorioId}:`, error);
    throw error; 
  }
};

export const updateLaboratorio = async (labId, data) => {
  try {
    const response = await api.put(`laboratorios/lab-update/${labId}/`, data);
    return response.data; 
  } catch (error) {
    console.error(`Erro ao atualizar o laboratório ${labId}:`, error);
    throw error;
  }
};

///Dispositivos

export const fetchDispData = async (dispIdNumber) => {
  try {
    const response = await api.get(`laboratorios/disp-by-id/?id_dispositivo=${dispIdNumber}`);
    return response.data.Dispositivos[0]; 
  } catch (error) {
    console.error('Erro ao buscar dados do dispositivo:', error);
    throw error; 
  }
};

export const updateDispositivo = async (dispId, data) => {
  try {
    const response = await api.put(`laboratorios/disp-update/${dispId}/`, data);
    return response.data; 
  } catch (error) {
    console.error(`Erro ao atualizar o dispositivo ${dispId}:`, error);
    throw error; 
  }
};

export const createDispositivo = async (data) => {
  try {
    const response = await api.post('laboratorios/disp-create/', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar dispositivo:', error);
    throw error;
  }
};

export const deleteDispositivo = async (dispositivoId) => {
  try {
    const response = await api.delete(`laboratorios/disp-delete/?id_dispositivo=${dispositivoId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar o dispositivo ${dispositivoId}:`, error);
    throw error;
  }
};

export const fetchDispositivos = async () => {
  try {
    const response = await api.get('laboratorios/disp-list/');
    return response.data.dispositivos;
  } catch (error) {
    console.error('Erro ao buscar lista de dispositivos:', error);
    throw error;
  }
};

export const fetchDispositivosByLab = async (idSala) => {
  try {
    const response = await api.get(`laboratorios/disp-by-lecc/?id_sala=${idSala}`);
    return response.data.Dispositivos;
  } catch (error) {
    console.error(`Erro ao buscar dispositivos para a sala ${idSala}:`, error);
    throw error;
  }
};

export const fetchDispositivosBySala = async (salaId) => {
  try {
    const response = await api.get('laboratorios/disp-by-lecc/', {
      params: { id_sala: salaId },
    });
    return response.data.Dispositivos;
  } catch (error) {
    console.error('Erro ao buscar os dispositivos:', error);
    throw error;
  }
};

export const fetchSoftwareByDisp = async (dispositivoId) => {
  try {
    const response = await api.get(`laboratorios/soft-by-disp/?id_dispositivo=${dispositivoId}`);
    return response.data.Software; 
  } catch (error) {
    console.error('Erro ao buscar software:', error);
    throw error;
  }
};

export const addSoftware = async (softwareData) => {
  try {
    const response = await api.post('laboratorios/soft-create/', softwareData);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar software:', error);
    throw error;
  }
};

export const deleteSoftware = async (softwareId) => {
  try {
    const response = await api.delete(`laboratorios/soft-delete/${softwareId}/`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar o software ${softwareId}:`, error);
    throw error; 
  }
};

///Observações

export const fetchObservacoes = async () => {
  try {
    const response = await api.get('problemas/obs-list/');
    return response.data.Observacao;
  } catch (error) {
    console.error('Erro ao buscar observações:', error);
    throw error;
  }
};

export const deleteObservacao = async (observacaoId) => {
  try {
    const response = await api.delete(`problemas/obs-delete/?id_observacao=${observacaoId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar a observação ${observacaoId}:`, error);
    throw error;
  }
};

export const createObservacao = async (data) => {
  try {
    const response = await api.post('problemas/obs-create/', data);
    return response.data; 
  } catch (error) {
    console.error('Erro ao criar observação:', error);
    throw error; 
  }
};

export const fetchObservacaoById = async (obsId) => {
  try {
    const response = await api.get(`problemas/obs-by-id/?id_observacao=${obsId}`);
    return response.data.observacao[0]; 
  } catch (error) {
    console.error('Erro ao buscar observação por ID:', error);
    throw error;
  }
};

export const updateObservacao = async (obsId, data) => {
  try {
    const response = await api.patch(`problemas/obs-update/${obsId}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar a observação ${obsId}:`, error);
    throw error;
  }
};

///Autenticação

export const login = async (username, password) => {
  try {
    const response = await api.post('auth/login/', { username, password });
    return response.data; 
  } catch (error) {
    console.error('Erro no login:', error.response?.data);
    throw error;
  }
};

export const fetchUsuarioInfo = async () => {
  try {
    const response = await api.get('auth/usuario-info/');
    return response.data; 
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error.response?.data);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('auth/registrar/', userData);
    return response.data; 
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
};

export const fetchUsuarios = async () => {
  try {
    const response = await api.get('auth/usuarios/listar/');
    return response.data; 
  } catch (error) {
    console.error('Erro ao buscar a lista de usuários:', error);
    throw error;
  }
};

export const updateUsuario = async (id, dadosUsuario) => {
  try {
    const response = await api.put(`auth/usuarios/${id}/editar/`, dadosUsuario);
    return response.data; 
  } catch (error) {
    console.error('Erro ao atualizar o usuário:', error);
    throw error;
  }
};

export const fetchUsuarioPorId = async (id) => {
  try {
    const response = await api.get(`auth/usuarios/${id}/`);
    return response.data; 
  } catch (error) {
    console.error('Erro ao buscar o usuário:', error);
    throw error;
  }
};

export const deleteUsuario = async (userId) => {
  try {
    const response = await api.delete(`auth/usuarios/${userId}/excluir/`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar o usuário ${userId}:`, error);
    throw error;
  }
};

export const redefinirSenha = async (dados) => {
  try {
    const response = await api.post('auth/trocar-senha/', dados);
    return response.data;
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    throw error;
  }
};

export const adminResetarSenha = async (id) => {
  try {
    const response = await api.put(`auth/resetar-senha/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao resetar senha do usuário:", error);
    throw error;
  }
};

export default api;