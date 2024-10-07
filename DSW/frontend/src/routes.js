import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Components from "./Components/Options";
import Machines from "./pages/Machines";
import Infrastructure from "./pages/Infrastructure";
import Feedback from "./pages/Feedback";




function AppRoutes() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Components/>}></Route> 
                <Route path="/machines" element={<Machines/>}></Route>
                <Route path="/infraatructure" element={<Infrastructure/>}></Route>
                <Route path="/feedback" element={<Feedback/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;