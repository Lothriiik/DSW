import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Components  from "./Components/Sidebar";
import Options from "./pages/Forms/Options";
import Machines from "./pages/Forms/Machines";
import Infrastructure from "./pages/Forms/Infrastructure";
import Feedback from "./pages/Forms/Feedback";
import DispByLab from "./pages/DispByLab";
import HomeAlmoxADM from "./pages/HomeAlmoxADM"
import ChartWithTable from "./pages/ChartWithTable";
import LoginPage from "./pages/LoginPage";



function AppRoutes() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/sidebar" element={<Components/>}></Route>
                <Route path="/" element={<DispByLab/>}></Route> 
                <Route path="/options" element={<Options/>}></Route>
                <Route path="/machines" element={<Machines/>}></Route>
                <Route path="/infraatructure" element={<Infrastructure/>}></Route>
                <Route path="/feedback" element={<Feedback/>}></Route>
                <Route path="/teste" element={<HomeAlmoxADM/>}></Route>
                <Route path="/tabela" element={<ChartWithTable idDispositivo={'2'}/>}></Route>
                <Route path="/login" element={<LoginPage/>}></Route>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;