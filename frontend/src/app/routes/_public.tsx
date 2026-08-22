import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/entities/identity';

export const Route = createFileRoute('/_public')({
    beforeLoad: () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
            throw redirect({ to: '/dashboard' });
        }
    },
    component: () => <Outlet />,
});
