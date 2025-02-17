import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Options from "./pages/Forms/Options";
import Machines from "./pages/Forms/Machines";
import Infrastructure from "./pages/Forms/Infrastructure";
import Feedback from "./pages/Forms/Feedback";
import DispByLab from "./pages/DispByLab";
import HomeAlmoxADM from "./pages/HomeAlmoxADM"
import LoginPage from "./pages/LoginPage";
import LabDispAdd from "./pages/LabDispAdd";
import LabDispEdit from "./pages/LabDispEdit";
import LabDispView from "./pages/LabDispView";
import Laboratories from "./pages/Laboratories";
import Observacao from "./pages/Observacao";
import ObservacaoAdd from "./pages/ObservacaoAdd";
import ObservacaoEdit from "./pages/ObservacaoEdit";
import ObservacaoView from "./pages/ObservacaoView";
import DispAll from "./pages/DispAll";



function AppRoutes() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Laboratories />} />
                <Route path="/Laboratories" element={<Laboratories />} />
                <Route path="/LabDispAdd" element={<LabDispAdd />} />
                <Route path="/LabDispEdit" element={<LabDispEdit/>}/>
                <Route path="/LabDispView" element={<LabDispView/>}/>
                <Route path="/dispositivos" element={<DispAll/>}/>
                <Route path="/laboratorio/:idSala" element={<DispByLab/>}></Route> 
                <Route path="/observacao" element={<Observacao/>}></Route> 
                <Route path="/observacaoadd" element={<ObservacaoAdd/>}></Route>
                <Route path="/observacaoedit" element={<ObservacaoEdit/>}></Route> 
                <Route path="/observacaoview" element={<ObservacaoView/>}></Route> 
                <Route path="/options" element={<Options/>}></Route>
                <Route path="/machines" element={<Machines/>}></Route>
                <Route path="/infraatructure" element={<Infrastructure/>}></Route>
                <Route path="/feedback" element={<Feedback/>}></Route>
                <Route path="/tabela" element={<HomeAlmoxADM/>}></Route>
                <Route path="/login" element={<LoginPage/>}></Route>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;