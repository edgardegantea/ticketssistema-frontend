// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import { ProtectedRoute } from './router/ProtectedRoute.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import Tickets from "./pages/admin/Tickets.jsx";
import TicketCreate from "./pages/admin/TicketCreate.jsx";
import TicketShow from  "./pages/admin/TicketShow.jsx";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="tickets" element={<Tickets />} />
                    <Route path="tickets/nuevo" element={<TicketCreate />} />
                    <Route path="tickets/:id" element={<TicketShow />} />
                    {/* futuras rutas admin aquí */}
                </Route>

                {/* opcional: redirigir / al dashboard */}
                <Route path="/" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
