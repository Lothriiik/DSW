import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import PrivateRoute from "./components/PrivateRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />

        {/* Rotas protegidas */}
        <Route
          path="/laboratorio"
          element={
            <PrivateRoute>
              <Laboratorio />
            </PrivateRoute>
          }
        />
        <Route
          path="/dispadd"
          element={
            <PrivateRoute>
              <DispAdd />
            </PrivateRoute>
          }
        />
        <Route
          path="/dispedit"
          element={
            <PrivateRoute>
              <DispEdit />
            </PrivateRoute>
          }
        />
        <Route
          path="/dispview"
          element={
            <PrivateRoute>
              <DispView />
            </PrivateRoute>
          }
        />
        <Route
          path="/dispositivos"
          element={
            <PrivateRoute>
              <DispAll />
            </PrivateRoute>
          }
        />
        <Route
          path="/dispbylab/:idSala"
          element={
            <PrivateRoute>
              <DispByLab />
            </PrivateRoute>
          }
        />
        <Route
          path="/observacao"
          element={
            <PrivateRoute>
              <Observacao />
            </PrivateRoute>
          }
        />
        <Route
          path="/observacaoadd"
          element={
            <PrivateRoute>
              <ObservacaoAdd />
            </PrivateRoute>
          }
        />
        <Route
          path="/observacaoedit"
          element={
            <PrivateRoute>
              <ObservacaoEdit />
            </PrivateRoute>
          }
        />
        <Route
          path="/observacaoview"
          element={
            <PrivateRoute>
              <ObservacaoView />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
