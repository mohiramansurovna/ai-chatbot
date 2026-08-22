import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/entities/identity';

type RouterContext = { queryClient: QueryClient };

export const Route = createRootRouteWithContext<RouterContext>()({
    beforeLoad: ({ location }) => {
        const { isAuthenticated } = useAuthStore.getState();
        const isPublicPath =
            location.pathname.startsWith('/login') || location.pathname.startsWith('/register');

        if (!isAuthenticated && !isPublicPath) {
            throw redirect({ to: '/login' });
        }
    },
    component: () => <Outlet />,
});
