// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import { ProtectedRoute } from './router/ProtectedRoute.jsx';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/admin" element={<Dashboard />} />
            </Route>
        </Routes>
    );
}

export default App;
