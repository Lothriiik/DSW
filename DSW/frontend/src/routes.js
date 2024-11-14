import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Components  from "./Components/Sidebar";
import Options from "./pages/Forms/Options";
import Machines from "./pages/Forms/Machines";
import Infrastructure from "./pages/Forms/Infrastructure";
import Feedback from "./pages/Forms/Feedback";
import DispByLab from "./pages/DispByLab";
import HomeAlmoxADM from "./pages/HomeAlmoxADM"
import LoginPage from "./pages/LoginPage";
import LabAdd from "./pages/LabAdd";



function AppRoutes() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Machines />} />
                <Route path="/LabAdd" element={<LabAdd />} />
                <Route path="/sidebar" element={<Components/>}></Route>
                <Route path="/dispositivos/:idSala" element={<DispByLab/>}></Route> 
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