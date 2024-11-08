import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Components  from "./Components/Header";
import Options from "./pages/Forms/Options";
import Machines from "./pages/Forms/Machines";
import Infrastructure from "./pages/Forms/Infrastructure";
import Feedback from "./pages/Forms/Feedback";
import Laboratories from "./pages/Laboratories";
import HomeAlmoxADM from "./pages/HomeAlmoxADM"
import ChartWithTable from "./pages/ChartWithTable";



function AppRoutes() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/header" element={<Components/>}></Route>
                <Route path="/" element={<Laboratories/>}></Route> 
                <Route path="/options" element={<Options/>}></Route>
                <Route path="/machines" element={<Machines/>}></Route>
                <Route path="/infraatructure" element={<Infrastructure/>}></Route>
                <Route path="/feedback" element={<Feedback/>}></Route>
                <Route path="/teste" element={<HomeAlmoxADM/>}></Route>
                <Route path="/tabela" element={<ChartWithTable/>}></Route>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;