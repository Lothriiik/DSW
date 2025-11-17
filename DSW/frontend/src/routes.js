import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DispByLab from "./pages/DispByLab";
import DispAdd from "./pages/DispAdd";
import DispEdit from "./pages/DispEdit";
import DispView from "./pages/DispView";
import Laboratorio from "./pages/Laboratorio";
import Observacao from "./pages/Observacao";
import ObservacaoAdd from "./pages/ObservacaoAdd";
import ObservacaoEdit from "./pages/ObservacaoEdit";
import ObservacaoView from "./pages/ObservacaoView";
import DispAll from "./pages/DispAll";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

import Usuarios from "./pages/Usuarios";
import Registrar from "./pages/Registrar";
import Sidebar from "./components/Sidebar/Sidebar";
import NovaSenha from "./pages/NovaSenha";
import "./routes.css";

import { Layout } from "antd";
import PasswordChangeRoute from "./components/PasswordChangeRoute";
import PrivateRoute from "./components/PrivateRoute";

import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const { Content } = Layout;

function Inside() {
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />

      <Layout>
        <Content className="contentAll">

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              style={{ height: "100%" }}
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/laboratorio" element={<PrivateRoute> <Laboratorio /> </PrivateRoute>} />
                <Route path="/dispadd" element={<PrivateRoute> <DispAdd /> </PrivateRoute>} />
                <Route path="/dispedit" element={<PrivateRoute> <DispEdit /> </PrivateRoute>} />
                <Route path="/dispview" element={<PrivateRoute> <DispView /> </PrivateRoute>} />
                <Route path="/dispositivos" element={<PrivateRoute> <DispAll /> </PrivateRoute>} />
                <Route path="/dispbylab/:idSala" element={<PrivateRoute> <DispByLab /> </PrivateRoute>} />
                <Route path="/observacao" element={<PrivateRoute> <Observacao /> </PrivateRoute>} />
                <Route path="/observacaoadd" element={<PrivateRoute> <ObservacaoAdd /> </PrivateRoute>} />
                <Route path="/observacaoedit" element={<PrivateRoute> <ObservacaoEdit /> </PrivateRoute>} />
                <Route path="/observacaoview" element={<PrivateRoute> <ObservacaoView /> </PrivateRoute>} />
                <Route path="/usuarios" element={<PrivateRoute> <Usuarios /> </PrivateRoute>} />
                <Route path="*" element={<PrivateRoute><NotFound /></PrivateRoute>} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Content>
      </Layout>
    </Layout>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/novasenha" element={<NovaSenha />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="*" element={<PrivateRoute><Inside /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
