import './App.css';
import {Route, Routes} from "react-router-dom";
import OrderList from "./components/Order-List/OrderList";
import OrderCreate from "./components/Order-Create/OrderCreate";
import OrderEdit from "./components/Order-Edit/OrderEdit";

function App() {
    return (<>
        <Routes>
            <Route path="/" element={<OrderList/>}/>
            <Route path="order-add" element={<OrderCreate/>}/>
            <Route path="order-edit/:id" element={<OrderEdit/>}/>
        </Routes>
    </>);
}

export default App;
