import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
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
import LoginPage from "./pages/LoginPage"



function AppRoutes() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Laboratorio />} />
                <Route path="/laboratorio" element={<Laboratorio />} />
                <Route path="/dispadd" element={<DispAdd />} />
                <Route path="/dispedit" element={<DispEdit/>}/>
                <Route path="/dispview" element={<DispView/>}/>
                <Route path="/dispositivos" element={<DispAll/>}/>
                <Route path="/dispbylab/:idSala" element={<DispByLab/>}></Route> 
                <Route path="/observacao" element={<Observacao/>}></Route> 
                <Route path="/observacaoadd" element={<ObservacaoAdd/>}></Route>
                <Route path="/observacaoedit" element={<ObservacaoEdit/>}></Route> 
                <Route path="/observacaoview" element={<ObservacaoView/>}></Route> 
                <Route path="/login" element={<LoginPage/>}></Route>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;