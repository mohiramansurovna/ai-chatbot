import { createBrowserRouter, Navigate } from 'react-router';
import { LoginPage, RegisterPage, DashboardPage, ChatPage } from './lazy-routes';

export const router = createBrowserRouter([
    { path: '/login', Component: LoginPage },
    { path: '/register', Component: RegisterPage },
    {
        path: '/',
        Component: DashboardPage,
        children: [
            { index: true, element: <Navigate to='/chat' replace /> },
            { path: 'chat', Component: ChatPage },
        ],
    },
]);
