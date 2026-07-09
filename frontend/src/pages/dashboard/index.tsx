import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router';
import { useAuthStore } from './hooks/useAuthStore';
import { useRefreshTokenQuery } from './hooks/useRefreshTokenQuery';
import { useMeQuery } from './hooks/useMeQuery';

export default function DashboardPage() {
    const { clearAuth, setToken, setUser, isAuthenticated, user } = useAuthStore();
    const { data: token, status, error } = useRefreshTokenQuery();

    useEffect(() => {
        if (status === 'error') {
            console.log(error);
            clearAuth();
            return;
        }
        if (status === 'success') {
            setToken(token);
        }
    }, [status, token, setToken, clearAuth, error]);

    const { data: me, status: meStatus, error: meError } = useMeQuery();

    useEffect(() => {
        if (meStatus === 'success') {
            setUser(me);
        }
        if (meStatus === 'error') {
            console.log(meError);
            clearAuth();
        }
    }, [meStatus, me, meError, setUser, clearAuth]);

    if (status === 'pending' || (isAuthenticated && !user)) {
        return (
            <div className='flex h-screen items-center justify-center text-muted-foreground'>
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }

    return <Outlet />;
}
