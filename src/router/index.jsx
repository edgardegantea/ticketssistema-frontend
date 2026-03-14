import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import Login from '../pages/Login';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';

export const router = createBrowserRouter([
    { path: '/login', element: <Login /> },
    {
        path: '/',
        element: <ProtectedRoute roleNeeded="admin" />,
        children: [
            {
                path: '/',
                element: <AdminLayout />,
                children: [
                    { index: true, element: <Dashboard /> },
                    // otras rutas admin...
                ],
            },
        ],
    },
]);
